const likeDAO = require("../dao/like.dao");
const threadDAO = require("../dao/thread.dao");
const userDAO = require("../dao/user.dao");

class LikeService {
  async likeThread(userId, threadId) {
    const user = await userDAO.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const thread = await threadDAO.getThreadById(threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }

    return likeDAO.likeThread(userId, threadId);
  }

  async unlikeThread(userId, threadId) {
    return likeDAO.unlikeThread(userId, threadId);
  }
}

module.exports = new LikeService();
