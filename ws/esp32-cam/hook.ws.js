const { Camera } = require("../../models/index.model")
const { onAfterUpdateCamera } = require("./hooks/camera.hook")

//

/**
 * Attaches hooks after the call so that it would be available upon express bind.
 * The hooks are attached to database models.
 */
const attachWsEsp32CamHooks = () => {

    // Attach camera hooks
    Camera.afterUpdate(onAfterUpdateCamera)
}

//

module.exports = { attachWsEsp32CamHooks }