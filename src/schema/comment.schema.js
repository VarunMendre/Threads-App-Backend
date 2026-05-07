const { gql } = require("apollo-server");

const commentTypeDefs = gql`
  type Comment {
    id: ID!
    content: String!
    user: User
    thread: Thread
    createdAt: String!
  }
`;

module.exports = commentTypeDefs;
