import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
// Middlewares
// import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { requestId } from "hono/request-id";
import { trimTrailingSlash } from "hono/trailing-slash";
// Plugins
import { openAPIRouteHandler } from "hono-openapi";

// Routes
import { routes } from "./routes";

const app = new Hono();
// app.use(compress());
app.use(cors());
app.use(logger());
app.use(prettyJSON());
app.use(requestId());
app.use(trimTrailingSlash());

// Routes
app.route("/", routes);

// OpenAPI
app.get(
  "/openapi.json",
  openAPIRouteHandler(routes, {
    documentation: {
      info: {
        description: "Simple Hono API",
        title: "Hono Starter",
        version: "1.0.0",
      },
    },
  }),
);

app.get("/playground", Scalar({ url: "/openapi.json" }));

// biome-ignore lint/style/noDefaultExport: safe
export default app;
