const threadService = require("../services/thread.service");
const likeDAO = require("../dao/like.dao");
const likeService = require("../services/like.service");
const commentService = require("../services/comment.service");
const { UnauthorizedError } = require("../utils/errors");

const threadResolvers = {
  Query: {
    getAllThreads: async () => {
      // Resolver delegates immediately to the service layer.
      // Services own validation and business decisions.
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

      // The authenticated user becomes the author automatically.
      // Clients do not choose arbitrary author ids.
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
    author: async (parent, _, { loaders }) => {
      // parent is the thread row returned by the query/mutation above.
      // We resolve related data lazily only when the GraphQL selection asks for it.
      return loaders.userLoader.load(parent.authorId);
    },
    likesCount: async (parent) => {
      return likeDAO.countLikesByThread(parent.id);
    },
    comments: async (parent) => {
      // Comment fetching is separated so simple thread queries do not
      // automatically load comments unless the client asks for them.
      return commentService.getComments(parent.id);
    },
  },
};

module.exports = threadResolvers;
