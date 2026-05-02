const commentDAO = require("../dao/comment.dao");
const threadDAO = require("../dao/thread.dao");
const userDAO = require("../dao/user.dao");

class CommentService {
  async addComment(userId, threadId, content) {
    if (!content || !content.trim()) {
      throw new Error("Content required");
    }

    const user = await userDAO.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const thread = await threadDAO.getThreadById(threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }

    return commentDAO.createComment({
      userId,
      threadId,
      content: content.trim(),
    });
  }

  async getComments(threadId) {
    return commentDAO.getCommentsByThread(threadId);
  }
}

module.exports = new CommentService();
