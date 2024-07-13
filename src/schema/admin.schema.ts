import Joi from "joi";

export const getUserQuerySchema = Joi.object({
  id: Joi.string()
    .guid({
      version: ["uuidv4"],
      separator: "-",
    })
    .optional()
    .messages({
      "string.guid": "Invalid UUID format",
      "string.empty": "Id is required for searching user",
    }),
}).options({
  stripUnknown: true,
});

export const createUserBodySchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required",
  }),

  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be a valid format",
  }),

  password: Joi.string()
    .required()
    .min(8)
    .messages({
      "any.required": "Password is required",
      "string.min": "Password must be atleast 8 character",
      "password.uppercase": "Password must contain a uppercase letter",
      "password.lowercase": "Password must contain a lowercase letter",
      "password.number": "Password must contain a number",
      "password.special": "Password must contain a special character",
    })
    .custom((value, helpers) => {
      if (!/[A-Z]/.test(value)) {
        return helpers.error("password.uppercase");
      } else if (!/[a-z]/.test(value)) {
        return helpers.error("password.lowercase");
      } else if (!/[0-9]/.test(value)) {
        return helpers.error("password.number");
      } else if (!/[!@#$%]/.test(value)) {
        return helpers.error("password.special");
      }
      return value;
    }),
  permissions: Joi.array()
    .items(
      Joi.string().valid(
        "users.get",
        "user.update",
        "user.delete",
        "users.create",
      ),
    )
    .optional()
    .default([]),
}).options({
  stripUnknown: true,
});

export const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email",
  }),
  password: Joi.string().optional(),
  permissions: createUserBodySchema.extract("permissions"),
}).options({
  stripUnknown: true,
});
