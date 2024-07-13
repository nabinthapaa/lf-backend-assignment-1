import Joi from "joi";

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

export const createTodoSchema = Joi.object({
  task: Joi.string().required().messages({
    "string.empty": "Task is required",
  }),
}).options({
  stripUnknown: true,
});

export const updateTodoQuerySchema = Joi.object({
  update: Joi.string().valid("status", "task").required().messages({
    "string.empty": "Update parameters not defined correctly",
  }),
}).options({
  stripUnknown: true,
});

export const updateTodoDataSchema = Joi.object({
  update: updateTodoQuerySchema.extract("update"),
  task: Joi.string().when("update", {
    is: "task",
    then: Joi.string().required().messages({
      "string.empty": "Task is not provided to update",
    }),
  }),
  isCompleted: Joi.bool().when("update", {
    is: "status",
    then: Joi.bool().required().messages({
      "bool.base": "Failed to update the task status",
    }),
  }),
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
