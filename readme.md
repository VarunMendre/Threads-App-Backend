# Threads Backend (GraphQL)

A backend for a Threads-like social media application built with GraphQL, Apollo Server, Prisma, and PostgreSQL.

The codebase is intentionally split into layers so data flow is easy to trace:

`GraphQL Request -> Resolver -> Service -> DAO -> Prisma -> Database`

## Tech Stack

- Node.js
- Apollo Server
- GraphQL
- Prisma ORM
- PostgreSQL
- Nodemon

## Project Structure

```text
src/
|-- index.js            # App entry point
|-- config/             # Env and Prisma configuration
|-- schema/             # GraphQL type definitions
|-- resolvers/          # GraphQL resolvers
|-- services/           # Business logic and validations
|-- dao/                # Data access layer
|-- utils/              # Shared helpers
```

## Architecture

```text
Client -> GraphQL API -> Resolvers -> Services -> DAO -> Database
```

- Resolvers handle GraphQL queries, mutations, and field resolution.
- Services enforce business rules and validations.
- DAO files are the only layer that talks directly to Prisma.
- PostgreSQL stores the application data.

## How To Read The Code

If you want to understand the code flow bit by bit, read it in this order:

1. `src/index.js`
   This is the application entry point. It creates the Apollo server, reads the JWT token from the request header, and builds the `context` object used by every resolver.
2. `src/schema/*.js`
   These files define what the GraphQL API looks like from the client side: types, queries, and mutations.
3. `src/resolvers/*.js`
   Resolvers are the first application layer that receives GraphQL input. They do small orchestration work and call services.
4. `src/services/*.js`
   Services hold the business rules: validation, authorization-related checks, duplicate prevention, missing-record checks, and pagination logic.
5. `src/dao/*.js`
   DAO files are the persistence layer. They run Prisma queries and return database rows.
6. `src/loaders/*.js`
   Loaders batch repeated relationship lookups inside a single request to avoid unnecessary database queries.

## Request Flow Examples

### Example 1: `createThread`

```text
Client mutation
  -> thread resolver checks authenticated user from context
  -> thread service validates title/content
  -> thread service confirms author exists
  -> thread DAO writes the row with Prisma
  -> created thread is returned to GraphQL
```

### Example 2: `getThreads`

```text
Client query
  -> thread resolver forwards limit/cursor args
  -> thread service validates pagination input
  -> thread DAO fetches limit + 1 rows using cursor logic
  -> thread service computes hasMore/nextCursor behavior
  -> GraphQL returns threads and nextCursor
```

### Example 3: nested `thread.author`

```text
Client asks for threads { author { name } }
  -> thread query fetches thread rows first
  -> Thread.author field resolver receives each thread as parent
  -> user DataLoader batches all author ids together
  -> Prisma fetches users in one batched query
  -> matching user is attached to each thread
```

## Current Features

- Apollo GraphQL server setup
- Prisma + PostgreSQL integration
- User and Thread schema definitions
- DAO layer for user and thread persistence
- Service layer for business logic
- Validation for required fields
- Duplicate email protection during registration
- Author existence validation before thread creation

## Implemented Services

### User Service

`src/services/user.service.js`

- `registerUser({ name, email, password })`
- `getUserById(id)`
- `getUserThreads(userId)`

Business rules:

- Prevents invalid registration and login payloads
- Prevents duplicate email registration
- Hashes passwords before saving
- Returns sanitized user data without password hashes
- Throws clear errors when a user is missing or credentials are invalid

### Thread Service

`src/services/thread.service.js`

- `createThread({ title, content, authorId })`
- `getAllThreads()`
- `getThreadById(id)`

Business rules:

- Prevents empty thread title or content
- Verifies that the author exists
- Implements cursor pagination
- Throws a clear error when a thread is missing

### Social Features

- `comment.service.js` validates comment content and checks that both user and thread exist before inserting a comment.
- `like.service.js` prevents duplicate likes and ensures the target thread exists.
- `follow.service.js` prevents self-following and duplicate follow relationships.

## GraphQL Operations

### Queries

```graphql
query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    name
    email
    threads {
      id
      title
    }
  }
}
```

```graphql
query GetAllThreads {
  getAllThreads {
    id
    title
    content
    author {
      id
      name
    }
  }
}
```

### Mutations

```graphql
mutation RegisterUser {
  registerUser(
    name: "Test User"
    email: "test@example.com"
    password: "123456"
  ) {
    id
    name
    email
  }
}
```

```graphql
mutation CreateThread {
  createThread(
    title: "Service Layer Thread"
    content: "Now we are using services"
  ) {
    id
    title
    content
  }
}
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env`

Add your environment variables in the project root:

```env
PORT=8000
DATABASE_URL=your_postgresql_connection_string
```

### 3. Generate Prisma client

```bash
npx prisma generate
```

### 4. Run the server

```bash
npm run dev
```

If PowerShell blocks `npm`, use:

```bash
npm.cmd run dev
```

## API Endpoint

Open GraphQL Playground at:

```text
http://localhost:8000/
```

## Phase Status

- Phase 1: Server setup
- Phase 2: Prisma and PostgreSQL setup
- Phase 3: GraphQL schema design
- Phase 4: DAO layer
- Phase 5: Service layer
- Phase 6: Authentication and authorization
- Phase 7: Production improvements

## Author

Varun Mendre
