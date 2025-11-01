import { Hono } from "hono";

import { todo } from "./todo";

export const routes = new Hono();

routes.route("/todo", todo);
