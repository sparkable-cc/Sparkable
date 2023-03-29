import Joi from 'joi';

export const signUpSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email':
        'This email is not valid. Please check for spelling errors and try again.',
      'string.empty': 'Email is required',
      'string.exists': 'This email is already in use. If this is you, sign in.',
    }),

  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.empty': 'Username is required',
    'string.length': 'Username must be at least 3 characters long',
    'string.exists':
      'This username is already in use. If this is you, sign in.',
  }),

  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^[a-zA-Z0-9!@#$%&*,)(~`\\/><. ]{3,30}$'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least one number and one letter',
      'string.empty': 'Password is required',
      'string.length':
        'This password is too short. Please use at least 8 characters and try again.',
    }),
});

export const signInSchema = Joi.object({
  login: Joi.string().required().messages({
    'string.empty': 'Email or username is required',
  }),

  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

export const passwordRecoverySchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email':
        'This email is not valid. Please check for spelling errors and try again.',
      'string.empty': 'Email is required',
    }),
});

export const passwordResetSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^[a-zA-Z0-9!@#$%&*,)(~`\\/><. ]{3,30}$'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least one number and one letter',
      'string.empty': 'Password is required',
      'string.length':
        'This password is too short. Please use at least 8 characters and try again.',
    }),
  token: Joi.string().required(),
  userUuid: Joi.string().required(),
});

export const validationInitialState = {
  field: '',
  message: '',
};
