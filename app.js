require('dotenv').config();
const express = require('express');
const app = express();
const path = require("path");
const adminRouter = require("./adminapi/router/route");

// const con = require('./adminapi/config/connection');
// const UserRouter = require('./webservice/Router/userRouter.js');

const cors = require('cors');
const bodyParser = require('body-parser');

// Static folder serve
// Your logo folder path: F:\Promax Parkom\Parkom_Server\logo
app.use('/logo', express.static(path.join(__dirname, 'logo')));
app.use('/images', express.static(path.join(__dirname, 'images')));    
const PORT = 3003;

// Middleware to parse JSON bodies
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


// app.use('/2024/parkom/server/webservice', UserRouter);
app.use('/coaching/adminapi', adminRouter);
// app.use('image/logo/use', imagelogo)

// Start the server


app.listen(PORT , () => {
    console.log("Working on port " + PORT);
});