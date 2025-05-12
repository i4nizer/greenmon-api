const express = require('express');
const router = express.Router();

const { postImageEsp32Schema } = require('../validations/esp32.validation')

const { upload } = require('../utils/upload.util');
const { checkJoi } = require('../middlewares/joi.middleware');

const { postImageEsp32 } = require('../controllers/esp32.controller');

//

router
    .route('/')
    .post(checkJoi(postImageEsp32Schema), upload.single('image'), postImageEsp32)

//
    
module.exports = router;