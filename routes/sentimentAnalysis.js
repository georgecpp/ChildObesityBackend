const router = require('express').Router();
require('dotenv').config();
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const { string } = require('@hapi/joi');


const key = process.env.TEXT_SENTIMENT_ANALYTICS_KEY;
const endpoint = process.env.TEXT_SENTIMENT_ANALYTICS_ENDPOINT;
// Authenticate the client with your key and endpoint
const textAnalyticsClient = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));


router.post('/', async (req, res) => {
    try {
        const phrase = req.body.phrase;
        if(!phrase) {
            return res.status(400).send('Send a phrase to analyze first!');
        }
    
        const documents = phrase.slice(0, -1).split(/[\.!]/);
    
        const results = await textAnalyticsClient.analyzeSentiment(documents);
        if(results) {
            var resultsInfo = results.map( function (result) {
                var resultItemInfo = {
                    "Overall Sentiment": result.sentiment,
                    "Scores": result.confidenceScores
                }
                return resultItemInfo; 
            });
            return res.status(200).send(resultsInfo);
        }
        else {
            return res.status(400).send('Couldn\'t process your feels');
        }
    }
    catch(err) {
        return res.status(500).send({message: err});
    }


});

module.exports = router;