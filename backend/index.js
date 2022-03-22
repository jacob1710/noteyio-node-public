const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const mongoose = require('mongoose');
const http = require('http');
const https = require('https');
const dotenv = require('dotenv').config({ path: './config.env' });
const app = express();
const admin = require('firebase-admin');
const port = process.env.PORT;
const db = process.env.DB_HOST;

// https://stackoverflow.com/questions/11744975/enabling-https-on-express-js
const privateKey = fs.readFileSync('./sslcert/key.pem');
const certificate = fs.readFileSync('./sslcert/cert.pem');

const options = { key: privateKey, cert: certificate };

// 1: Middleware
app.use(morgan('dev'));
app.use(express.json());

let mongooseConnection;

try {
    mongoose.connect(db, {
        useNewUrlParser: true,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
    }).then((connection) => {
        mongooseConnection = connection;
        console.log('Connected to the DB');
    });
} catch (e) {
    console.log(e);
    console.log('error connecting to the database');
    process.exit();
}


// Firebase
// To get it working accross the board, file will be included,
// for production - this needs to be and will be stored as an environment variable
const serviceAccount = require('./firebase_config/noteyio-cecaf-firebase-adminsdk-jteu3-9a8f305e82.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Routes
const router = require('./routes/routes');
const { connect } = require('http2');
app.use('/api/', router);


const httpsServer = http.createServer(app);
const httpServer = https.createServer(options, app);

module.exports = httpsServer;