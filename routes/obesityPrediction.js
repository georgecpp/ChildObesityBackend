const express = require('express');
const router = express.Router();
const {raw, response} = require('express');
const {spawn} = require('child_process');
const path = require('path');
require('dotenv').config();


function predict_obesity(args) {
    return new Promise((resolve) => {
        const pyprog = spawn('python', [process.cwd() + '/main.py', args]);
        pyprog.stderr.on('data', (data) => {
            resolve(`ps stderr: ${data}`);
        });
        pyprog.stdout.on('data', function(data)  {
            resolve(data.toString());
        });

    });
}

router.post('/', async (req, res) => {
    let args = req.body.args;
    if(!args) {
        res.status(400).send('No args sent for the script!');
    }
    predict_obesity(args)
    .then(response => {
        res.status(200).send(response);
    })
    .catch(err => {
        res.status(400).send({error: err});
    }); 

});

module.exports = router;