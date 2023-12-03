//server.js
require('dotenv').config()
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./database/dbInit');

const userRouter = require('./routes/user');

const app = express();

app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: 'text/plain' }));
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.use('/programit', userRouter);

connectDB()
    .then(() => {
    // Database is connected, start the server
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
    })
    .catch((error) => {
    console.error(`Error connecting to the database: ${error}`);
    });
