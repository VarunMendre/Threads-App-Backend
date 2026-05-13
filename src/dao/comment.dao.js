const prisma = require("../config/prisma");

class CommentDAO {
  async createComment(data) {
    return prisma.comment.create({
      data,
    });
  }

  async getCommentsByThread(threadId) {
    return prisma.comment.findMany({
      where: { threadId },
      // Latest comments first keeps the API response aligned with thread ordering.
      orderBy: { createdAt: "desc" },
    });
  }
}

module.exports = new CommentDAO();
