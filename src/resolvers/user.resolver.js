const userService = require("../services/user.service");

module.exports = {
  Query: {
    getUser: (_, { id }) => userService.getUserById(id),
  },
  Mutation: {
    registerUser: (_, args) => userService.registerUser(args),
  },
  User: {
    threads: (parent) => userService.getUserThreads(parent.id),
  },
};
