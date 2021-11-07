const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Welcome to home page!');
});

module.exports = router;