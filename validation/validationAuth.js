const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = (data) => {
    
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });

    return schema.validate(data);
};

// Login Validation
const loginValidation = (data) => {

    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });

    return schema.validate(data);
};

module.exports = {
    registerValidation,
    loginValidation
}