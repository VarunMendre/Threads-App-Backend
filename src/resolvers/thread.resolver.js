const threadService = require("../services/thread.service");
const userService = require("../services/user.service");
const likeDAO = require("../dao/like.dao");
const likeService = require("../services/like.service");
const commentService = require("../services/comment.service");
const { UnauthorizedError } = require("../utils/errors");

const threadResolvers = {
  Query: {
    getAllThreads: async () => {
      return threadService.getAllThreads();
    },
    getThreads: async (_, args) => {
      return threadService.getThreads(args);
    },

    getThreadById: async (_, { id }) => {
      return threadService.getThreadById(id);
    },
  },

  Mutation: {
    createThread: async (_, args, { user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      return threadService.createThread({
        ...args,
        authorId: user.id,
      });
    },
    likeThread: async (_, { threadId }, { user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      await likeService.likeThread(user.id, threadId);
      return true;
    },
    unlikeThread: async (_, { threadId }, { user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      await likeService.unlikeThread(user.id, threadId);
      return true;
    },
    addComment: async (_, { threadId, content }, { user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      return commentService.addComment(user.id, threadId, content);
    },
  },

  Thread: {
    author: async (parent) => {
      return userService.getUserById(parent.authorId);
    },
    likesCount: async (parent) => {
      const likes = await likeDAO.getLikesByThread(parent.id);
      return likes.length;
    },
    comments: async (parent) => {
      return commentService.getComments(parent.id);
    },
  },
};

module.exports = threadResolvers;
