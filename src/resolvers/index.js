const userResolvers = require("./user.resolver");
const threadResolvers = require("./thread.resolver");
const threadDAO = require("../dao/thread.dao");

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
  Comment: {
    user: async (parent, _, { loaders }) => {
      return loaders.userLoader.load(parent.userId);
    },
    thread: async (parent) => {
      return threadDAO.getThreadById(parent.threadId);
    },
  },
};

module.exports = resolvers;
