const express = require('express');

const routes = express.Router();

const multer = require('multer')

const CodeController = require('./controllers/CodeController')
const MailController = require('./controllers/MailController')

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
routes.post('/send/', upload.single('file'), MailController.handleSendEmail);
routes.get('/token/', CodeController.getToken);

module.exports = routes;
