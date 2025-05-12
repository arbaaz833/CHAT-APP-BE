import Joi from "joi";

const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

const registerValidation = Joi.object({
    userName: Joi.string()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.empty': 'Username is required',
        'string.min': 'Username must be at least 3 characters',
        'string.max': 'Username must be less than 30 characters',
      }),
  
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email',
      }),
  
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters',
      }),
      profilePicture: Joi.string()
  })

export {
    loginValidation,
    registerValidation
}