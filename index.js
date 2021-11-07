const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');



// Import routes
const homeRoute = require('./routes/home');
const chatbotRoute = require('./routes/chatbot');
const authRoute = require('./routes/auth');
const sentimentAnalysisRouter = require('./routes/sentimentAnalysis');
const obesityPredictionRouter = require('./routes/obesityPrediction');

// Connect to DB  -- implement.
mongoose.connect(process.env.DB_CONNECTION, () => {
    console.log('connected to db!')
});


// Middlewares
app.use(express.json());


// Route Middlewares
app.use('/', homeRoute);
app.use('/children/chatbot', chatbotRoute);
app.use('/auth', authRoute);
app.use('/parent/sentiment', sentimentAnalysisRouter);
app.use('/parent/obesityPrediction', obesityPredictionRouter);

app.listen(process.env.PORT || 2000, () => {
    console.log('Server Up and running!');
});