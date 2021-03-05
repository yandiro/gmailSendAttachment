const express = require('express');
const routes = express.Router();

const multer = require('multer')

const CodeController = require('./controllers/CodeController')
const MailController = require('./controllers/MailController')
const AttachmentController = require('./controllers/AttachmentController')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage })


routes.post('/code/', CodeController.setCode);
routes.post('/send/', MailController.handleSendEmail);
routes.post('/uploadfile/', upload.single('file'), AttachmentController.handleFileUpload);
routes.get('/token/', CodeController.getToken);

module.exports = routes;
