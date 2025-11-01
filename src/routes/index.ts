import { Hono } from "hono";

import { todo } from "./todo.js";

export const routes = new Hono();

routes.route("/todo", todo);
