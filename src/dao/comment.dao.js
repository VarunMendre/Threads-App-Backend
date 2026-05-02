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
      orderBy: { createdAt: "desc" },
    });
  }
}

module.exports = new CommentDAO();
