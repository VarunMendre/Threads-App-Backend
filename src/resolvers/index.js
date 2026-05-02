const userResolvers = require("./user.resolver");
const threadResolvers = require("./thread.resolver");
const userService = require("../services/user.service");
const threadService = require("../services/thread.service");

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
    user: async (parent) => {
      return userService.getUserById(parent.userId);
    },
    thread: async (parent) => {
      return threadService.getThreadById(parent.threadId);
    },
  },
};

module.exports = resolvers;
