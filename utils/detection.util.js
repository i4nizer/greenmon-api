const tf = require('@tensorflow/tfjs-node')
const fs = require('fs')
const path = require('path')

//

const config = {
    modelPath: `file://${path.resolve(__dirname, "../ai/v1/model.json")}`,
    modelName: "yolov11n-640",
    modelClasses: ["Healthy", "Nitrogen Deficient", "Phosphorus Deficient", "Potassium Deficient"],
    modelInputSize: [640, 640],
}

//

/**
 * Loads, resizes, and normalizes an image from disk.
 *
 * @param {string} path Path to the image file.
 * @returns {tf.Tensor4D} Preprocessed image tensor.
 */
const preprocess = (path) => {
    return tf.tidy(() => {
        const imageBuffer = fs.readFileSync(path);
        const decoded = tf.node.decodeImage(imageBuffer, 3); // RGB
        return decoded
            .resizeBilinear(config.modelInputSize)
            .toFloat()
            .div(255.0)
            .expandDims(0); // [1, height, width, 3]
    });
};

/**
 * YOLOv11 has prediction vector of [cx, cy, w, h, classes].
 *
 * @param {tf.NamedTensorMap | tf.Tensor<tf.Rank> | tf.Tensor<tf.Rank>[]} vector The prediction vector.
 */
const extract = (vector) => {
    return tf.tidy(() => {
        // note: not normalized, in range of < 640
        const cx = vector.slice([0, 0], [-1, 1]).squeeze();
        const cy = vector.slice([0, 1], [-1, 1]).squeeze();
        const w = vector.slice([0, 2], [-1, 1]).squeeze();
        const h = vector.slice([0, 3], [-1, 1]).squeeze();

        // note: normalized, softmaxed
        const classes = vector.slice([0, 4], [-1, -1]);
        const indices = classes.argMax(1);
        const objectness = classes.max(1);

        return [cx, cy, w, h, indices, objectness];
    })
}

/**
 * Convert a box to x1, y1, x2, y2.
 */
const corners = (cx, cy, w, h) => {
    return tf.tidy(() => {
        // divide once
        const two = tf.scalar(2);
        const [halfW, halfH] = [w.div(two), h.div(two)];

        // get coordinates
        const x1 = cx.sub(halfW);
        const y1 = cy.sub(halfH);
        const x2 = cx.add(halfW);
        const y2 = cy.add(halfH);

        return [x1, y1, x2, y2];
    })
}

/**
 * Filters boxes based on IoU and objectness.
 *
 * @returns Indices of boxes that passed.
 */
const nms = async (boxes, scores, minIoU, minScore, maxBoxCount) => {
    const indices = await tf.image.nonMaxSuppressionAsync(
        boxes,
        scores,
        maxBoxCount,
        minIoU,
        minScore
    );

    return indices;
}

/**
 * @returns JS arrays versions.
 */
const arrify = async (...tensors) => {
    return await Promise.all(tensors.map(t => t.array()));
}

/**
 * Use nms indices to find the passed boxes.
 *
 * @returns {{ 
 *      box: { x: Number, y: Number, w: Number, h: Number }, 
 *      class: String,
 *      confidence: Number
 * }[]} Array of bounding boxes.
 */
const mapclass = (nmsi, boxes, scores, indices) => {
    const result = [];

    for (const i of nmsi) {
        // normalize
        const box = {
            x: boxes[i][0] / config.modelInputSize[0],
            y: boxes[i][1] / config.modelInputSize[0],
            w: boxes[i][2] / config.modelInputSize[0],
            h: boxes[i][3] / config.modelInputSize[0],
        };

        // map class to get string
        const label = config.modelClasses.at(indices[i]);
        const confidence = scores[i]
        
        result.push({ box, class: label, confidence });
    }

    return result;
}

/**
 *
 * @param {tf.NamedTensorMap | tf.Tensor<tf.Rank>
 * | tf.Tensor<tf.Rank>[]} prediction The result of this prediction.
 */
const postprocess = async (prediction, minIoU = 0.5, minScore = 0.4, maxBoxCount = 100) => {
    
    // encapsulate for cleanup
    const [boxes, cornerBoxes, objectness, indices] = tf.tidy(() => {
        // convert [1, 8, 8400] into [8400, 8] where 8 is classes
        const raw = prediction.squeeze(0).transpose();
        
        // extract
        const [cx, cy, w, h, indices, objectness] = tf.tidy(() => extract(raw));
        const [x1, y1, x2, y2] = tf.tidy(() => corners(cx, cy, w, h));
        
        // stack
        const boxes = tf.stack([x1, y1, w, h], 1);
        const cornerBoxes = tf.stack([x1, y1, x2, y2], 1);

        return [boxes, cornerBoxes, objectness, indices];
    })

    // index
    const nmsi = await nms(
        cornerBoxes,
        objectness,
        minIoU,
        minScore,
        maxBoxCount
    );

    // js arrays
    const [nmsiArr, boxesArr, objectnessArr, indicesArr] = await arrify(nmsi, boxes, objectness, indices);

    // cleanup remaining tensors
    tf.dispose([nmsi, cornerBoxes, boxes, objectness, indices]);

    // result
    return mapclass(
        nmsiArr,
        boxesArr,
        objectnessArr,
        indicesArr
    );
}

//

/** 
 * Use only one instance of the model. 
 * @type {tf.GraphModel}
 */
let modelInstance = null
let modelLoading = false

/**
 * Retrieves saved model from indexeddb else fetches it.
 */
const load = async () => {
    if (modelLoading) {
        return new Promise(res => {
            const interval = setInterval(() => {
                if (modelInstance == null) return
                clearInterval(interval)
                res(modelInstance)
            }, 50)
        })
    }
    
    if (modelInstance) return modelInstance;

    modelLoading = true
    const model = await tf.loadGraphModel(config.modelPath)
    modelInstance = model
    modelLoading = false

    // Warm up the model
    await predict(`${path.resolve(__dirname, "../images/warmers/healthy.jpg")}`)
    await predict(`${path.resolve(__dirname, "../images/warmers/nitrogen.jpg")}`)
    await predict(`${path.resolve(__dirname, "../images/warmers/phosphorus.jpg")}`)
    await predict(`${path.resolve(__dirname, "../images/warmers/potassium.jpg")}`)

    return model;
}

/**
 * Invokes prediction and returns necessary results.
 * 
 * @param {string} path Path to the image file.
 */
const predict = async (path, minScore = 0.4, minIoU = 0.5, maxBoxCount = 100) => {
    modelInstance ??= await load()
    
    const prediction = tf.tidy(() => {
        const imageTensor = preprocess(path)
        return modelInstance.execute(imageTensor)
    })

    const bboxes = await postprocess(prediction, minIoU, minScore, maxBoxCount)
    if (Array.isArray(prediction)) prediction.forEach(p => p.dispose());
    else prediction.dispose();
    
    return bboxes
}

const unload = () => {
    if (!modelInstance) return;
    modelInstance.dispose();
    modelInstance = null;
}

//

module.exports = { load, predict, unload }