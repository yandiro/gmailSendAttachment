require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

mongoose.connect(process.env.mongoURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

const routes = require('./routes');

const server = express();

server.use(express.json());
server.use(routes);

server.listen(process.env.PORT);


