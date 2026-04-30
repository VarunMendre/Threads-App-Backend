const userService = require("../services/user.service");
const userDAO = require("../dao/user.dao");

const userResolvers = {
  Query: {
    getUser: async (_, { id }) => {
      return userService.getUserById(id);
    },
  },

  Mutation: {
    registerUser: async (_, args) => {
      return userService.registerUser(args);
    },
  },

  User: {
    threads: async (parent) => {
      return userDAO.getUserThreads(parent.id);
    },
  },
};

module.exports = userResolvers;
