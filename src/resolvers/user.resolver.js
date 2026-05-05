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
    followers: async (parent) => {
      const followers = await followDAO.getFollowersByUser(parent.id);
      return Promise.all(
        followers.map((follow) => userService.getUserById(follow.followerId))
      );
    },
    following: async (parent) => {
      const following = await followDAO.getFollowingByUser(parent.id);
      return Promise.all(
        following.map((follow) => userService.getUserById(follow.followingId))
      );
    },
  },
};

module.exports = userResolvers;
