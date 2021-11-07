const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation/validationAuth');
const bcrypt = require('bcryptjs');
require('dotenv').config();


// Register Route
router.post('/register', async (req, res) => {
    // LET'S VALIDATE THE DATA BEFORE WE MAKE A USER!!
    const {error} = registerValidation(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    // check if user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) {
        return res.status(400).send('Email already exists!');
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    // create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    }
    catch(err) {
        res.status(400).send(err);
    }
});


// Login Route
router.post('/login', async (req, res) => {
    // LET'S VALIDATE THE DATA BEFORE WE LOGIN THE USER!
    const {error} = loginValidation(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    // checking if the email exists in the database
    const user = await User.findOne({email: req.body.email});
    if(!user) {
        return res.status(400).send('Email doesn\'t exist!');
    }

    // Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) {
        return res.status(400).send('Invalid Password!');
    }

    res.status(200).send('Login Successfully!');

    // // create and assign token
    // const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    // res.header('auth-token', token).send(token);

});

module.exports = router;