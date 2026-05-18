# Threads Backend

A GraphQL backend for a Threads-like social media app built with Node.js, Apollo Server, Prisma, and PostgreSQL.

The project uses a layered flow so features are easy to trace:

`GraphQL Request -> Resolver -> Service -> DAO -> Prisma -> PostgreSQL`

## Tech Stack

- Node.js
- Apollo Server
- GraphQL
- Prisma ORM
- PostgreSQL
- JWT authentication
- DataLoader
- Zod validation

## Features

- User registration and login
- JWT-based authentication
- Create and fetch threads
- Cursor-based thread pagination
- Like and unlike threads
- Add comments to threads
- Follow and unfollow users
- Batched nested user resolution with DataLoader
- Layered architecture with resolvers, services, and DAOs

## Project Structure

```text
src/
|-- index.js
|-- config/
|   |-- env.js
|   |-- prisma.js
|-- schema/
|   |-- index.js
|   |-- user.schema.js
|   |-- thread.schema.js
|   |-- comment.schema.js
|-- resolvers/
|   |-- index.js
|   |-- user.resolver.js
|   |-- thread.resolver.js
|-- services/
|   |-- user.service.js
|   |-- thread.service.js
|   |-- comment.service.js
|   |-- like.service.js
|   |-- follow.service.js
|-- dao/
|   |-- user.dao.js
|   |-- thread.dao.js
|   |-- comment.dao.js
|   |-- like.dao.js
|   |-- follow.dao.js
|-- loaders/
|   |-- user.loader.js
|-- utils/
|   |-- errors.js
|   |-- logger.js
|   |-- validators.js
prisma/
|-- schema.prisma
|-- migrations/
docs/
|-- code-flow.md
```

## Data Model

The Prisma schema currently includes these models:

- `User`
- `Thread`
- `Like`
- `Comment`
- `Follow`

Relationships supported by the API:

- A user can create many threads
- A user can like many threads
- A user can comment on many threads
- A user can follow many users and be followed by many users

## Authentication

- `loginUser` returns a JWT token
- Send the token in the `Authorization` header
- Format: `Bearer <token>`
- Authenticated mutations automatically use `context.user.id`

Example:

```http
Authorization: Bearer your_jwt_token
```

## GraphQL API

### Queries

```graphql
query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    name
    email
    followers {
      id
      name
    }
    following {
      id
      name
    }
    threads {
      id
      title
    }
  }
}
```

```graphql
query GetThreads($limit: Int, $cursor: String) {
  getThreads(limit: $limit, cursor: $cursor) {
    threads {
      id
      title
      content
      likesCount
      author {
        id
        name
      }
      comments {
        id
        content
      }
    }
    nextCursor
  }
}
```

```graphql
query GetThreadById($id: ID!) {
  getThreadById(id: $id) {
    id
    title
    content
    createdAt
    author {
      id
      name
    }
    comments {
      id
      content
      user {
        id
        name
      }
    }
  }
}
```

### Mutations

```graphql
mutation RegisterUser {
  registerUser(
    name: "Varun"
    email: "varun@example.com"
    password: "123456"
  ) {
    id
    name
    email
    createdAt
  }
}
```

```graphql
mutation LoginUser {
  loginUser(email: "varun@example.com", password: "123456") {
    token
    user {
      id
      name
      email
    }
  }
}
```

```graphql
mutation CreateThread {
  createThread(title: "First thread", content: "Hello from GraphQL backend") {
    id
    title
    content
    createdAt
  }
}
```

```graphql
mutation LikeThread($threadId: ID!) {
  likeThread(threadId: $threadId)
}
```

```graphql
mutation AddComment($threadId: ID!, $content: String!) {
  addComment(threadId: $threadId, content: $content) {
    id
    content
    createdAt
  }
}
```

```graphql
mutation FollowUser($userId: ID!) {
  followUser(userId: $userId)
}
```

## Validation Rules

Current service-level validation includes:

- `name` must be at least 2 characters
- `password` must be at least 6 characters
- `title` is required
- `content` is required for threads and comments
- pagination `limit` must be between 1 and 50

The code uses Zod schemas in [src/utils/validators.js](/E:/VARUN/NodeJs_crash_course/NodeJs/projects/Threads-App-Backend/src/utils/validators.js).

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=8000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/threads_db
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### 3. Run Prisma migrations

```bash
npx prisma migrate dev
```

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Start the server

```bash
npm run dev
```

If PowerShell blocks `npm`, use:

```bash
npm.cmd run dev
```

## Local API Endpoint

When the server is running locally, Apollo Server starts at:

```text
http://localhost:8000/
```

## Code Reading Guide

If you want to understand the app flow quickly, read files in this order:

1. [src/index.js](/E:/VARUN/NodeJs_crash_course/NodeJs/projects/Threads-App-Backend/src/index.js)
2. [src/schema/index.js](/E:/VARUN/NodeJs_crash_course/NodeJs/projects/Threads-App-Backend/src/schema/index.js)
3. [src/resolvers/index.js](/E:/VARUN/NodeJs_crash_course/NodeJs/projects/Threads-App-Backend/src/resolvers/index.js)
4. `src/services/*.js`
5. `src/dao/*.js`
6. [docs/code-flow.md](/E:/VARUN/NodeJs_crash_course/NodeJs/projects/Threads-App-Backend/docs/code-flow.md)

## Notes

- Password hashes are never returned in GraphQL responses
- Nested user lookups are batched per request with DataLoader
- Thread pagination uses cursor-based pagination, not offset pagination
- Prisma indexes are already added for thread listing performance

## Author

Varun Mendre
