import { Schema } from "effect";
import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";

export const todo = new Hono();

const TodoSchema = Schema.Struct({
  createdAt: Schema.String,
  id: Schema.String,
  isCompleted: Schema.Boolean,
  title: Schema.String,
});

type Todo = Schema.Schema.Type<typeof TodoSchema>;

const todos = new Map<string, Todo>();

const GetTodosReturnSchema = Schema.standardSchemaV1(Schema.Array(TodoSchema));

todo.get(
  "/",
  describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(GetTodosReturnSchema),
          },
        },
        description: "Success",
      },
    },
  }),
  (c) => {
    const allTodos = Array.from(todos.values());
    return c.json(allTodos);
  },
);

const GetTodoRequestSchema = Schema.standardSchemaV1(
  Schema.Struct({
    id: Schema.String,
  }),
);

const GetTodoReturnSchema = Schema.standardSchemaV1(TodoSchema);

todo.get(
  "/:id",
  describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(GetTodoReturnSchema),
          },
        },
        description: "Success",
      },
    },
  }),
  validator("param", GetTodoRequestSchema),
  (c) => {
    const { id } = c.req.valid("param");
    const todo = todos.get(id);
    return c.json(todo);
  },
);

const CreateTodoRequestSchema = Schema.standardSchemaV1(
  TodoSchema.omit("id", "createdAt"),
);
const CreateTodoReturnSchema = Schema.standardSchemaV1(TodoSchema);

todo.post(
  "/create",
  describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(CreateTodoReturnSchema),
          },
        },
        description: "Successful response",
      },
    },
  }),
  validator("json", CreateTodoRequestSchema),
  (c) => {
    const data = c.req.valid("json");
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const todo = { ...data, createdAt, id };
    todos.set(id, todo);
    return c.json(todo);
  },
);

const UpdateTodoRequestSchema = Schema.standardSchemaV1(
  Schema.partial(TodoSchema.omit("id", "createdAt")),
);

const UpdateTodoReturnSchema = Schema.standardSchemaV1(TodoSchema);
const ErrorSchema = Schema.standardSchemaV1(
  Schema.Struct({ error: Schema.String, success: Schema.Boolean }),
);

todo.patch(
  "/:id",
  describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(UpdateTodoReturnSchema),
          },
        },
        description: "Successful response",
      },
      404: {
        content: {
          "application/json": {
            schema: resolver(ErrorSchema),
          },
        },
        description: "Error response",
      },
    },
  }),
  validator("json", UpdateTodoRequestSchema),
  (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const todo = todos.get(id);
    if (!todo) {
      return c.json(
        { error: "Todo not found", success: false },
        { status: 404 },
      );
    }
    const updatedTodo = { ...todo, ...data };
    todos.set(id, updatedTodo);
    return c.json(updatedTodo);
  },
);
