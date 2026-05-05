const likeDAO = require("../dao/like.dao");
const threadDAO = require("../dao/thread.dao");
const userDAO = require("../dao/user.dao");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class LikeService {
  async likeThread(userId, threadId) {
    const user = await userDAO.getUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const thread = await threadDAO.getThreadById(threadId);
    if (!thread) {
      throw new NotFoundError("Thread not found");
    }

    const existingLike = await likeDAO.getLike(userId, threadId);
    if (existingLike) {
      throw new BadRequestError("Thread already liked");
    }

    return likeDAO.likeThread(userId, threadId);
  }

  async unlikeThread(userId, threadId) {
    const existingLike = await likeDAO.getLike(userId, threadId);
    if (!existingLike) {
      throw new NotFoundError("Like not found");
    }

    return likeDAO.unlikeThread(userId, threadId);
  }
}

module.exports = new LikeService();
