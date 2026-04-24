require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server");
const { PORT } = require("./config/env");

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

// Start server
server.listen({ port: PORT }).then(({ url }) => {
  console.log(`Server running at ${url}`);
});
