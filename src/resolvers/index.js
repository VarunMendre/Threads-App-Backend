const userResolvers = require("./user.resolver");
const threadResolvers = require("./thread.resolver");
const threadDAO = require("../dao/thread.dao");

const resolvers = {
  Query: {
    // Domain-specific resolver files stay small and focused.
    // They are merged here into the final schema resolver map.
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
      // Comments store threadId, so the parent comment becomes the input
      // for fetching the related thread only when requested by GraphQL.
      return threadDAO.getThreadById(parent.threadId);
    },
  },
};

module.exports = resolvers;
