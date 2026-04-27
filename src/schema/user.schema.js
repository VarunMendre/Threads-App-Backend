const { gql } = require("apollo-server");

const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    threads: [Thread]
    createdAt: String!
  }

  extend type Query {
    getUser(id: ID!): User
  }

  extend type Mutation {
    registerUser(
      name: String!
      email: String!
      password: String!
    ): User
  }
`;

module.exports = userTypeDefs;
