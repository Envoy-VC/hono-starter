import { serve as I } from "@hono/node-server";
import { Scalar as V } from "@scalar/hono-api-reference";
import { Schema as o } from "effect";
import { Hono as A, Hono as H, Hono as h } from "hono";
import { compress as w } from "hono/compress";
import { cors as x } from "hono/cors";
import { logger as G } from "hono/logger";
import { prettyJSON as U } from "hono/pretty-json";
import { requestId as C } from "hono/request-id";
import { trimTrailingSlash as E } from "hono/trailing-slash";
import {
  resolver as i,
  describeRoute as m,
  openAPIRouteHandler as P,
  validator as S,
} from "hono-openapi";

var n = new h(),
  a = o.Struct({
    createdAt: o.String,
    id: o.String,
    isCompleted: o.Boolean,
    title: o.String,
  }),
  d = new Map(),
  f = o.standardSchemaV1(o.Array(a));
n.get(
  "/",
  m({
    responses: {
      200: {
        content: { "application/json": { schema: i(f) } },
        description: "Success",
      },
    },
  }),
  (e) => {
    const t = Array.from(d.values());
    return e.json(t);
  },
);
var g = o.standardSchemaV1(o.Struct({ id: o.String })),
  T = o.standardSchemaV1(a);
n.get(
  "/:id",
  m({
    responses: {
      200: {
        content: { "application/json": { schema: i(T) } },
        description: "Success",
      },
    },
  }),
  S("param", g),
  (e) => {
    const { id: t } = e.req.valid("param"),
      s = d.get(t);
    return e.json(s);
  },
);
var j = o.standardSchemaV1(a.omit("id", "createdAt")),
  v = o.standardSchemaV1(a);
n.post(
  "/create",
  m({
    responses: {
      200: {
        content: { "application/json": { schema: i(v) } },
        description: "Successful response",
      },
    },
  }),
  S("json", j),
  (e) => {
    const t = e.req.valid("json"),
      s = crypto.randomUUID(),
      p = new Date().toISOString(),
      c = { ...t, createdAt: p, id: s };
    return d.set(s, c), e.json(c);
  },
);
var y = o.standardSchemaV1(o.partial(a.omit("id", "createdAt"))),
  R = o.standardSchemaV1(a),
  q = o.standardSchemaV1(o.Struct({ error: o.String, success: o.Boolean }));
n.patch(
  "/:id",
  m({
    responses: {
      200: {
        content: { "application/json": { schema: i(R) } },
        description: "Successful response",
      },
      404: {
        content: { "application/json": { schema: i(q) } },
        description: "Error response",
      },
    },
  }),
  S("json", y),
  (e) => {
    const t = e.req.param("id"),
      s = e.req.valid("json"),
      p = d.get(t);
    if (!p)
      return e.json({ error: "Todo not found", success: !1 }, { status: 404 });
    const c = { ...p, ...s };
    return d.set(t, c), e.json(c);
  },
);
var u = new A();
u.route("/todo", n);
var r = new H();
r.use(w());
r.use(x());
r.use(G());
r.use(U());
r.use(C());
r.use(E());
r.route("/", u);
r.get(
  "/openapi.json",
  P(u, {
    documentation: {
      info: {
        description: "Simple Hono API",
        title: "Hono Starter",
        version: "1.0.0",
      },
    },
  }),
);
r.get("/playground", V({ url: "/openapi.json" }));
var l = I({ fetch: r.fetch, port: 3e3 }, (e) => {
  const t = `http://localhost:${e.port}`;
  console.log(`Server: ${t}`), console.log(`Playground: ${t}/playground`);
});
process.on("SIGINT", () => {
  l.close(), process.exit(0);
});
process.on("SIGTERM", () => {
  l.close((e) => {
    e && (console.error(e), process.exit(1)), process.exit(0);
  });
});
