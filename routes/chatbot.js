const router = require('express').Router();
const axios = require('axios');
require('dotenv').config();

const AZURE_QNA_SERVICE_URL = process.env.AZURE_QNA_SERVICE_URL;

const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

const client = new TextAnalyticsClient(process.env.TEXT_SENTIMENT_ANALYTICS_ENDPOINT, new AzureKeyCredential(process.env.TEXT_SENTIMENT_ANALYTICS_KEY));

var token_strikes = new Map();

const msg_alert_strikes = "I feel that you are good now, what about going out and have some fun? :)";

async function isHypedMessageSentiment(documents) {
  const results = await client.analyzeSentiment(documents);
  if(results) {
      if(results[0].sentiment === "positive" && results[0].confidenceScores.positive >= 0.80) {
          return 1;
      }
      return 0;
  }
  return -1;
}

router.get('/', (req, res) => {
    res.send('Welcome to Chatbot. Express your feelings.');
});


router.post('/', async (req, res) => {
    const messageFromUser = req.body.message;
    let reply="";
    if(!messageFromUser) {
        res.status(400).send('Write a message first!');
        return;
    }

    const tokenSession = req.body.tokenSession;
    if(!tokenSession) {
        res.status(400).send('Send a session token first!');
        return;
    }
    if(!token_strikes.has(tokenSession)) {
        token_strikes.set(tokenSession,0);
    }
    else {
        if(token_strikes.get(tokenSession) >= 3) {
            token_strikes.delete(tokenSession);
            return res.status(200).send(msg_alert_strikes);
        }
    }

    const documents = [messageFromUser];
    const isHypedMessageSent = await isHypedMessageSentiment(documents);
    if(isHypedMessageSent === 1) {
        token_strikes.set(tokenSession,token_strikes.get(tokenSession)+1);
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': process.env.AZURE_QNA_SERVICE_AUTH_KEY
    };

    axios.post(AZURE_QNA_SERVICE_URL,
    {
        question: messageFromUser
    },
    {
        headers: headers
    })
    .then((response) => {
        reply = response.data.answers[0].answer;
        if(reply) {
            res.status(200).send(reply);
        }
        else {
            res.status(400).send('Can\'t reply. Tell me something else!');
        }
    })
    .catch((err) => {
        console.log(err);
    });
});

module.exports = router;