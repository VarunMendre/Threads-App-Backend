const userResolvers = require("./user.resolver");
const threadResolvers = require("./thread.resolver");

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...threadResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...threadResolvers.Mutation,
  },
  User: userResolvers.User,
  Thread: threadResolvers.Thread,
};

module.exports = resolvers;
