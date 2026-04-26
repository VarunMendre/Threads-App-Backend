require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server");
const { PORT } = require("./config/env");
const prisma = require("./config/prisma");

// Temporary schema
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Temporary resolver
const resolvers = {
  Query: {
    hello: () => "Threads Backend Running 🚀",
  },
};

// Create server
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
