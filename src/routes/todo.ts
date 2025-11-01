import { Schema } from "effect";
import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";

export const todo = new Hono();

const TodoSchema = Schema.Struct({
  createdAt: Schema.Date,
  id: Schema.String,
  isCompleted: Schema.Boolean,
  title: Schema.String,
});

type Todo = Schema.Schema.Type<typeof TodoSchema>;

const todos = new Map<string, Todo>();

todo.get(
  "/",
  describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(Schema.standardSchemaV1(Schema.Array(TodoSchema))),
          },
        },
        description: "Successful Response",
      },
    },
  }),
  validator("json", Schema.standardSchemaV1(Schema.Undefined)),
  (c) => {
    const allTodos = Array.from(todos.values());
    return c.json(allTodos);
  },
);

todo.get(
  "/:id",
  describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(
              Schema.standardSchemaV1(
                Schema.Union(TodoSchema, Schema.Undefined),
              ),
            ),
          },
        },
        description: "Successful Response",
      },
    },
  }),
  validator("json", Schema.standardSchemaV1(Schema.Undefined)),
  (c) => {
    const id = c.req.param("id");
    const todo = todos.get(id);
    return c.json(todo);
  },
);

todo.post(
  "/create",
  describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(Schema.standardSchemaV1(TodoSchema)),
          },
        },
        description: "Successful Response",
      },
    },
  }),
  validator(
    "json",
    Schema.standardSchemaV1(TodoSchema.omit("id", "createdAt")),
  ),
  (c) => {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const data = c.req.valid("json");
    const todo: Todo = { ...data, createdAt, id };
    todos.set(id, todo);
    return c.json(todo);
  },
);

todo.delete(
  "/:id",
  describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(
              Schema.standardSchemaV1(
                Schema.Struct({
                  error: Schema.Union(Schema.String, Schema.Null),
                  success: Schema.Boolean,
                }),
              ),
            ),
          },
        },
        description: "Successful Response",
      },
      404: {
        content: {
          "application/json": {
            schema: resolver(
              Schema.standardSchemaV1(
                Schema.Struct({
                  error: Schema.String,
                  success: Schema.Boolean,
                }),
              ),
            ),
          },
        },
        description: "Not Found",
      },
    },
  }),
  validator("json", Schema.standardSchemaV1(Schema.Undefined)),
  (c) => {
    const id = c.req.param("id");
    const todo = todos.get(id);
    if (!todo) {
      return c.json(
        { error: "Todo not found", success: false },
        { status: 404 },
      );
    }
    todos.delete(id);
    return c.json({ error: null, success: true });
  },
);

todo.patch(
  "/:id",
  describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(Schema.standardSchemaV1(TodoSchema)),
          },
        },
        description: "Successful Response",
      },
      404: {
        content: {
          "application/json": {
            schema: resolver(
              Schema.standardSchemaV1(
                Schema.Struct({
                  error: Schema.String,
                  success: Schema.Boolean,
                }),
              ),
            ),
          },
        },
        description: "Not Found",
      },
    },
  }),
  validator(
    "json",
    Schema.standardSchemaV1(TodoSchema.omit("id", "createdAt")),
  ),
  (c) => {
    const id = c.req.param("id");
    const todo = todos.get(id);
    if (!todo) {
      return c.json(
        {
          error: "Todo not found",
          success: false,
        },
        { status: 404 },
      );
    }
    const data = c.req.valid("json");
    const updatedTodo = { ...todo, ...data };
    todos.set(id, updatedTodo);
    return c.json(updatedTodo);
  },
);
