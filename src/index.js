require('dotenv').config();
const mongoose = require('mongoose');

const express = require('express');
const cors = require('cors')

const server = express();
const routes = require('./routes');

server.use(cors());

server.use(express.json());
server.use(routes);


mongoose.connect(process.env.mongoURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

server.listen(process.env.PORT);


