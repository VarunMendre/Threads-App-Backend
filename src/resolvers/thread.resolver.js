const threadService = require("../services/thread.service");
const userService = require("../services/user.service");

const threadResolvers = {
  Query: {
    getAllThreads: async () => {
      return threadService.getAllThreads();
    },

    getThreadById: async (_, { id }) => {
      return threadService.getThreadById(id);
    },
  },

  Mutation: {
    createThread: async (_, args) => {
      return threadService.createThread(args);
    },
  },

  Thread: {
    author: async (parent) => {
      return userService.getUserById(parent.authorId);
    },
  },
};

module.exports = threadResolvers;
