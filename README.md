# Hono Starter

A modern, type-safe API starter project built with [Hono](https://hono.dev/), featuring OpenAPI integration with the [Effect](https://effect.website/) framework for schema validation and API documentation.

## Features

- 🚀 **Fast & Lightweight**: Built on Hono, one of the fastest web frameworks
- 📝 **OpenAPI Integration**: Automatic OpenAPI schema generation with `hono-openapi`
- ✨ **Effect Framework**: Type-safe schema validation using Effect Schema
- 🎨 **API Playground**: Interactive API documentation with Scalar
- 🔧 **Production Ready**: Includes essential middlewares and error handling
- 📦 **TypeScript**: Full TypeScript support with type safety

## Tech Stack

- **Framework**: [Hono](https://hono.dev/) v4.10.4
- **Runtime**: Node.js with `@hono/node-server`
- **Validation**: [Effect](https://effect.website/) v3.18.4
- **OpenAPI**: [hono-openapi](https://github.com/honojs/hono-openapi) v1.1.0
- **Documentation**: [Scalar](https://scalar.com/) API Reference
- **Package Manager**: pnpm

## Middlewares

The following middlewares are configured in the application:

- **compress**: Response compression for better performance
- **cors**: Cross-Origin Resource Sharing support
- **logger**: Request logging middleware
- **prettyJSON**: Pretty-printed JSON responses
- **requestId**: Automatic request ID generation for tracing
- **trimTrailingSlash**: Normalizes trailing slashes in URLs

## Routes

### Todo API (`/todo`)

The project includes a complete Todo CRUD API demonstrating the integration of Hono, OpenAPI, and Effect Schema.

#### Endpoints

- `GET /todo` - Get all todos
- `GET /todo/:id` - Get a todo by ID
- `POST /todo/create` - Create a new todo
- `PATCH /todo/:id` - Update a todo

#### Todo Schema

```typescript
{
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
}
```

### API Documentation

- `GET /openapi.json` - OpenAPI 3.0 specification
- `GET /playground` - Interactive API documentation (Scalar)

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server with hot reload
pnpm dev
```

The server will start on `http://localhost:3000` by default.

- **Server**: http://localhost:3000
- **API Playground**: http://localhost:3000/playground
- **OpenAPI Spec**: http://localhost:3000/openapi.json

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Scripts

- `pnpm dev` - Start development server with hot reload (tsx watch)
- `pnpm build` - Compile TypeScript to JavaScript
- `pnpm start` - Run production server
- `pnpm lint` - Run Biome linter and auto-fix issues
- `pnpm format` - Format code with Biome

## Project Structure

```
hono-starter/
├── src/
│   ├── index.ts          # Main application entry point
│   └── routes/
│       ├── index.ts      # Route aggregation
│       └── todo.ts       # Todo API routes
├── package.json
├── tsconfig.json
└── README.md
```

## OpenAPI Integration

This project uses `hono-openapi` with Effect Schema for type-safe OpenAPI documentation. Routes are automatically documented using:

- `describeRoute()` - Describes route metadata and responses
- `validator()` - Validates request parameters/body using Effect Schema
- `resolver()` - Resolves Effect Schema types for OpenAPI generation
- `Schema.standardSchemaV1()` - Effect Schema compatible with OpenAPI

### Example Route

```typescript
import { Schema } from "effect";
import { describeRoute, resolver, validator } from "hono-openapi";

const TodoSchema = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  isCompleted: Schema.Boolean,
  createdAt: Schema.String,
});

todo.get(
  "/",
  describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(Schema.Array(TodoSchema)),
          },
        },
        description: "Success",
      },
    },
  }),
  (c) => c.json(todos)
);
```

## Code Quality

This project uses:

- **Biome**: Fast formatter and linter (configured in `biome.json`)
- **Lefthook**: Git hooks manager (configured in `lefthook.yml`)
- **Commitlint**: Commit message linting (configured in `commitlint.config.ts`)

## License

MIT

