require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const { PORT } = require("./config/env");
const prisma = require("./config/prisma");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      req,
    };
  },
});

async function startServer() {
  await prisma.$connect();

  console.log("Database connected successfully");

  const { url } = await server.listen({ port: PORT });
  console.log(`Server running at ${url}`);
}

startServer().catch(async (error) => {
  console.error("Failed to start server", error);
  await prisma.$disconnect();
  process.exit(1);
});
