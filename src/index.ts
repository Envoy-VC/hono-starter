// import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";

// Middlewares
// import { compress } from "hono/compress";
// import { cors } from "hono/cors";
// import { logger } from "hono/logger";
// import { prettyJSON } from "hono/pretty-json";
// import { requestId } from "hono/request-id";
// import { trimTrailingSlash } from "hono/trailing-slash";
// Plugins
// import { openAPIRouteHandler } from "hono-openapi";

// Routes
// import { routes } from "./routes";

const app = new Hono();
// app.use(compress());
// app.use(cors());
// app.use(logger());
// app.use(prettyJSON());
// app.use(requestId());
// app.use(trimTrailingSlash());

// Routes
// app.route("/", routes);

// Todo API
type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

const todos = new Map<string, Todo>();

// GET /todos - Get all todos
app.get("/todos", (c) => {
  const allTodos = Array.from(todos.values());
  return c.json(allTodos);
});

// GET /todos/:id - Get a single todo
app.get("/todos/:id", (c) => {
  const id = c.req.param("id");
  const todo = todos.get(id);

  if (!todo) {
    return c.json({ error: "Todo not found" }, 404);
  }

  return c.json(todo);
});

// POST /todos - Create a new todo
app.post("/todos", async (c) => {
  const body = await c.req.json<{ title: string; completed?: boolean }>();

  if (!body.title || typeof body.title !== "string") {
    return c.json({ error: "Title is required" }, 400);
  }

  const id = crypto.randomUUID();
  const todo: Todo = {
    completed: body.completed ?? false,
    createdAt: new Date().toISOString(),
    id,
    title: body.title,
  };

  todos.set(id, todo);
  return c.json(todo, 201);
});

// PATCH /todos/:id - Update a todo
app.patch("/todos/:id", async (c) => {
  const id = c.req.param("id");
  const todo = todos.get(id);

  if (!todo) {
    return c.json({ error: "Todo not found" }, 404);
  }

  const body = await c.req.json<{ title?: string; completed?: boolean }>();
  const updatedTodo: Todo = {
    ...todo,
    ...(body.title !== undefined && { title: body.title }),
    ...(body.completed !== undefined && { completed: body.completed }),
  };

  todos.set(id, updatedTodo);
  return c.json(updatedTodo);
});

// DELETE /todos/:id - Delete a todo
app.delete("/todos/:id", (c) => {
  const id = c.req.param("id");
  const todo = todos.get(id);

  if (!todo) {
    return c.json({ error: "Todo not found" }, 404);
  }

  todos.delete(id);
  return c.json({ message: "Todo deleted successfully" });
});

// OpenAPI
// app.get(
//   "/openapi.json",
//   openAPIRouteHandler(routes, {
//     documentation: {
//       info: {
//         description: "Simple Hono API",
//         title: "Hono Starter",
//         version: "1.0.0",
//       },
//     },
//   }),
// );

// app.get("/playground", Scalar({ url: "/openapi.json" }));

// biome-ignore lint/style/noDefaultExport: safe
export default app;
