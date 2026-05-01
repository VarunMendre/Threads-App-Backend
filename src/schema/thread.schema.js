const { gql } = require("apollo-server");

const threadTypeDefs = gql`
  type Thread {
    id: ID!
    title: String!
    content: String!
    author: User!
    createdAt: String!
  }

  extend type Query {
    getAllThreads: [Thread!]!
    getThreadById(id: ID!): Thread
  }

  extend type Mutation {
    createThread(
      title: String!
      content: String!
    ): Thread
  }
`;

module.exports = threadTypeDefs;
