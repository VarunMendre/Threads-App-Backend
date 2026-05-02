const { gql } = require("apollo-server");

const userTypeDefs = gql`
  type AuthPayload {
    token: String!
    user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    threads: [Thread]
    followers: [User!]!
    following: [User!]!
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
    loginUser(email: String!, password: String!): AuthPayload
    followUser(userId: ID!): Boolean!
    unfollowUser(userId: ID!): Boolean!
  }
`;

module.exports = userTypeDefs;
