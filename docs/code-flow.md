# Code Flow Guide

This document explains how data moves through the backend, step by step, so the codebase is easier to read during development.

## Main Rule

The project follows this direction of responsibility:

`Resolver -> Service -> DAO -> Prisma`

Each layer should do one kind of work:

- Resolver:
  Reads GraphQL args and request context.
- Service:
  Validates input, checks business rules, and decides whether an operation is allowed.
- DAO:
  Runs database queries only.
- Loader:
  Optimizes repeated relationship fetching inside one request.

## Request Lifecycle

### 1. Request enters Apollo Server

File: `src/index.js`

- Apollo receives the HTTP request.
- The `Authorization` header is checked for a Bearer token.
- If the token is valid, `context.user = { id: decoded.userId }` is created.
- A fresh `userLoader` is also created for that request.

That means every resolver can access:

- `context.user` for authentication
- `context.loaders.userLoader` for batched user lookups

### 2. Resolver receives GraphQL input

Files:

- `src/resolvers/thread.resolver.js`
- `src/resolvers/user.resolver.js`
- `src/resolvers/index.js`

Resolvers are intentionally thin. They usually do one of these things:

- reject unauthenticated access
- forward args to a service
- resolve nested fields like `Thread.author` or `User.followers`

Example:

- `createThread` reads mutation args
- checks `context.user`
- passes `{ ...args, authorId: user.id }` to `threadService.createThread`

### 3. Service applies business rules

Files:

- `src/services/user.service.js`
- `src/services/thread.service.js`
- `src/services/comment.service.js`
- `src/services/like.service.js`
- `src/services/follow.service.js`

This is the most important layer when you want to understand app behavior.

Examples:

- `user.service.js`
  validates registration/login input, hashes passwords, creates JWTs, and removes password hashes from API responses.
- `thread.service.js`
  validates thread input, ensures the author exists, and computes pagination output.
- `follow.service.js`
  blocks self-follow and duplicate follow records.

### 4. DAO executes Prisma queries

Files:

- `src/dao/user.dao.js`
- `src/dao/thread.dao.js`
- `src/dao/comment.dao.js`
- `src/dao/like.dao.js`
- `src/dao/follow.dao.js`

DAO methods should stay simple. They translate the service request into Prisma queries.

Examples:

- `threadDAO.createThread(data)` inserts a thread
- `likeDAO.getLike(userId, threadId)` checks the composite unique key
- `followDAO.getFollowersByUser(userId)` fetches follow relationship rows

### 5. Nested GraphQL fields are resolved lazily

Important files:

- `src/resolvers/thread.resolver.js`
- `src/resolvers/user.resolver.js`
- `src/resolvers/index.js`
- `src/loaders/user.loader.js`

When a client asks for nested data, GraphQL does not automatically join everything at once. Instead:

- parent object is returned first
- field resolver runs only if that field is requested
- loader may batch repeated lookups

Example:

If the client requests:

```graphql
query {
  getAllThreads {
    id
    title
    author {
      id
      name
    }
  }
}
```

Flow:

- `getAllThreads` returns thread rows
- for each thread, `Thread.author` runs
- `userLoader` collects author ids
- loader performs one batched user query
- results are mapped back to the matching threads

## Pagination Flow

File: `src/dao/thread.dao.js`

The thread list uses cursor pagination, not offset pagination.

How it works:

- threads are sorted by `createdAt DESC, id DESC`
- when a cursor is provided, the DAO first loads that cursor thread
- then it fetches rows that come after it in that same sort order
- it requests `limit + 1` rows
- the service trims the extra row and computes `nextCursor`

The extra row is only used to answer: "is there another page?"

## Authentication Flow

### Register

- resolver calls `userService.registerUser`
- service validates input
- service checks whether email already exists
- password is hashed with `bcrypt`
- DAO creates the user
- service returns sanitized user data

### Login

- resolver calls `userService.loginUser`
- service validates input
- service finds user by email
- password is compared with stored hash
- JWT token is created with `userId`
- token and sanitized user are returned

### Authenticated mutation later

- client sends `Authorization: Bearer <token>`
- `src/index.js` verifies the token
- `context.user.id` becomes available
- resolver uses that id instead of trusting client-provided ownership data

## Best Reading Order

When you want to understand one feature from start to finish, use this sequence:

1. GraphQL schema definition
2. Resolver method
3. Service method
4. DAO method
5. Related field resolvers
6. Loader if related user data is involved

For example, to understand likes:

1. find the `likeThread` mutation in schema files
2. open `src/resolvers/thread.resolver.js`
3. open `src/services/like.service.js`
4. open `src/dao/like.dao.js`

That path shows the full story with the least jumping around.
