const { gql } = require("apollo-server");
const userTypeDefs = require("./user.schema");
const threadTypeDefs = require("./thread.schema");

const rootTypeDefs = gql`
  type Query
  type Mutation
`;

module.exports = [rootTypeDefs, userTypeDefs, threadTypeDefs];
