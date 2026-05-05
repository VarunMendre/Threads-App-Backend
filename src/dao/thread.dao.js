const prisma = require("../config/prisma");

class ThreadDAO {
  async getAllThreads() {
    return prisma.thread.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getPaginatedThreads(limit, cursor) {
    return prisma.thread.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" },
      ],
    });
  }

  async getThreadById(id) {
    return prisma.thread.findUnique({
      where: { id },
    });
  }

  async createThread(data) {
    return prisma.thread.create({
      data,
    });
  }

  async deleteThread(id) {
    return prisma.thread.delete({
      where: { id },
    });
  }
}

module.exports = new ThreadDAO();
