const prisma = require("../config/prisma");

class UserDAO {
  async getUserById(id) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data) {
    return prisma.user.create({
      data,
    });
  }

  async getUserThreads(userId) {
    return prisma.thread.findMany({
      where: { authorId: userId },
    });
  }
}

module.exports = new UserDAO();
