const commentDAO = require("../dao/comment.dao");
const threadDAO = require("../dao/thread.dao");
const userDAO = require("../dao/user.dao");
const { NotFoundError } = require("../utils/errors");
const { commentSchema, validate } = require("../utils/validators");

class CommentService {
  async addComment(userId, threadId, content) {
    const validatedData = validate(commentSchema, { content });

    const user = await userDAO.getUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const thread = await threadDAO.getThreadById(threadId);
    if (!thread) {
      throw new NotFoundError("Thread not found");
    }

    return commentDAO.createComment({
      userId,
      threadId,
      content: validatedData.content,
    });
  }

  async getComments(threadId) {
    return commentDAO.getCommentsByThread(threadId);
  }
}

module.exports = new CommentService();
