const prisma = require("../config/prisma");

class ThreadDAO {
  async getAllThreads() {
    return prisma.thread.findMany({
      orderBy: { createdAt: "desc" },
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
