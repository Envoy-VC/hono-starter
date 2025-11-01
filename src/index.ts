import { serve } from "@hono/node-server";
import { Hono } from "hono";
// Middlewares
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { requestId } from "hono/request-id";
import { trimTrailingSlash } from "hono/trailing-slash";

const app = new Hono();
app.use(compress());
app.use(cors());
app.use(logger());
app.use(prettyJSON());
app.use(requestId());
app.use(trimTrailingSlash());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
