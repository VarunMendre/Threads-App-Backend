const userService = require("../services/user.service");
const userDAO = require("../dao/user.dao");
const followDAO = require("../dao/follow.dao");
const followService = require("../services/follow.service");
const { UnauthorizedError } = require("../utils/errors");

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
    loginUser: async (_, args) => {
      return userService.loginUser(args);
    },
    followUser: async (_, { userId }, { user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      await followService.followUser(user.id, userId);
      return true;
    },
    unfollowUser: async (_, { userId }, { user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      await followService.unfollowUser(user.id, userId);
      return true;
    },
  },

  User: {
    threads: async (parent) => {
      return userDAO.getUserThreads(parent.id);
    },
    followers: async (parent, _, { loaders }) => {
      const followers = await followDAO.getFollowersByUser(parent.id);
      return loaders.userLoader.loadMany(
        followers.map((follow) => follow.followerId)
      );
    },
    following: async (parent, _, { loaders }) => {
      const following = await followDAO.getFollowingByUser(parent.id);
      return loaders.userLoader.loadMany(
        following.map((follow) => follow.followingId)
      );
    },
  },
};

module.exports = userResolvers;
