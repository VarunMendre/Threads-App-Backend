const { ApolloServer } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { PORT, JWT_SECRET, NODE_ENV } = require("./config/env");
const prisma = require("./config/prisma");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const createUserLoader = require("./loaders/user.loader");
const { error: logError, log } = require("./utils/logger");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const authHeader = req.headers.authorization || "";
    let user = null;

    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, JWT_SECRET);
        user = { id: decoded.userId };
      } catch (error) {
        log("Invalid token received");
      }
    }

    return {
      req,
      user,
      loaders: {
        userLoader: createUserLoader(),
      },
    };
  },
  formatError: (err) => {
    const statusCode =
      err.originalError?.statusCode ||
      err.extensions?.exception?.statusCode ||
      500;

    if (statusCode >= 500) {
      logError("Unhandled GraphQL error", err);
    }

    return {
      message: err.message,
      statusCode,
      ...(NODE_ENV === "development" ? { path: err.path } : {}),
    };
  },
});

async function startServer() {
  await prisma.$connect();

  log("Database connected successfully");

  const { url } = await server.listen({ port: PORT });
  log(`Server running at ${url}`);
}

startServer().catch(async (startupError) => {
  logError("Failed to start server", startupError);
  await prisma.$disconnect();
  process.exit(1);
});
