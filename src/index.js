require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const { PORT } = require("./config/env");
const prisma = require("./config/prisma");
const typeDefs = require("./schema");
const userDao = require("./dao/user.dao");
const threadDao = require("./dao/thread.dao");

const resolvers = {
  Query: {},
  Mutation: {},
};

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
  // await testDAO();

  console.log("Database connected successfully");

  const { url } = await server.listen({ port: PORT });
  console.log(`Server running at ${url}`);
}

async function testDAO() {
  const user = await userDao.createUser({
    name: "Varun",
    email: `varun+${Date.now()}@test.com`,
    password: "123456",
  });

  console.log("User Created:", user);

  const thread = await threadDao.createThread({
    title: "My First Thread",
    content: "Hello GraphQL",
    authorId: user.id,
  });

  console.log("Thread Created:", thread);

  const threads = await threadDAO.getAllThreads();
  console.log("All Threads:", threads);
}

startServer().catch(async (error) => {
  console.error("Failed to start server", error);
  await prisma.$disconnect();
  process.exit(1);
});
