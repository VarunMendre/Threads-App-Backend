const prisma = require("../config/prisma");

class LikeDAO {
  async getLike(userId, threadId) {
    return prisma.like.findUnique({
      where: {
        userId_threadId: { userId, threadId },
      },
    });
  }

  async likeThread(userId, threadId) {
    return prisma.like.create({
      data: { userId, threadId },
    });
  }

  async unlikeThread(userId, threadId) {
    return prisma.like.delete({
      where: {
        userId_threadId: { userId, threadId },
      },
    });
  }

  async getLikesByThread(threadId) {
    return prisma.like.findMany({
      where: { threadId },
    });
  }
}

module.exports = new LikeDAO();
