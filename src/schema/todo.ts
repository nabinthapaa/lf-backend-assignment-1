import Joi from "joi";

export const getTodos = Joi.object().options({
  stripUnknown: true,
});

export const queryTodo = Joi.object({
  id: Joi.string()
    .guid({
      version: ["uuidv4"],
      separator: "-",
    })
    .required()
    .messages({
      "string.guid": "Invalid UUID format",
      "string.empty": "Id is required for searching user",
    }),
}).options({
  stripUnknown: true,
});

export const createTodo = Joi.object({
  task: Joi.string().required().messages({
    "string.empty": "Task is required",
  }),
}).options({
  stripUnknown: true,
});

export const updateTodoTask = Joi.object({
  task: Joi.string().required().messages({
    "string.empty": "Please provide a task to update with",
  }),
}).options({
  stripUnknown: true,
});

export const updateTodoStatus = Joi.object({
  status: Joi.bool().default(false),
}).options({
  stripUnknown: true,
});

export const deleteTodo = Joi.object({
  id: Joi.string().required().messages({
    "string.empty": "Id must be provided to delete a string",
  }),
}).options({
  stripUnknown: true,
});
