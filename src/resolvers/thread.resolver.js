const userDAO = require("../dao/user.dao");
const threadService = require("../services/thread.service");

module.exports = {
  Query: {
    getAllThreads: () => threadService.getAllThreads(),
    getThreadById: (_, { id }) => threadService.getThreadById(id),
  },
  Mutation: {
    createThread: (_, args) => threadService.createThread(args),
  },
  Thread: {
    author: (parent) => userDAO.getUserById(parent.authorId),
  },
};
