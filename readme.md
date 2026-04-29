# Threads Backend (GraphQL)

A backend for a Threads-like social media application built with GraphQL, Apollo Server, Prisma, and PostgreSQL.

The project now follows a clean layered flow:

`Resolvers -> Services -> DAO -> Database`

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

- Prevents empty registration fields
- Prevents duplicate email registration
- Throws a clear error when a user is missing

### Thread Service

`src/services/thread.service.js`

- `createThread({ title, content, authorId })`
- `getAllThreads()`
- `getThreadById(id)`

Business rules:

- Prevents empty thread title or content
- Verifies that the author exists
- Throws a clear error when a thread is missing

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
mutation CreateThread($authorId: ID!) {
  createThread(
    title: "Service Layer Thread"
    content: "Now we are using services"
    authorId: $authorId
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
