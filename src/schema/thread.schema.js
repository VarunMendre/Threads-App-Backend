const { gql } = require("apollo-server");

const threadTypeDefs = gql`
  type Thread {
    id: ID!
    title: String!
    content: String!
    author: User!
    likesCount: Int!
    comments: [Comment!]!
    createdAt: String!
  }

  type ThreadPagination {
    threads: [Thread!]!
    nextCursor: String
  }

  extend type Query {
    getAllThreads: [Thread!]!
    getThreads(limit: Int, cursor: String): ThreadPagination!
    getThreadById(id: ID!): Thread
  }

  extend type Mutation {
    createThread(
      title: String!
      content: String!
    ): Thread
    likeThread(threadId: ID!): Boolean!
    unlikeThread(threadId: ID!): Boolean!
    addComment(threadId: ID!, content: String!): Comment!
  }
`;

module.exports = threadTypeDefs;
