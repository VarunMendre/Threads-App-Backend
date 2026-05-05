const prisma = require("../config/prisma");

class FollowDAO {
  async getFollow(followerId, followingId) {
    return prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
  }

  async followUser(followerId, followingId) {
    return prisma.follow.create({
      data: { followerId, followingId },
    });
  }

  async unfollowUser(followerId, followingId) {
    return prisma.follow.delete({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
  }

  async getFollowersByUser(userId) {
    return prisma.follow.findMany({
      where: { followingId: userId },
    });
  }

  async getFollowingByUser(userId) {
    return prisma.follow.findMany({
      where: { followerId: userId },
    });
  }
}

module.exports = new FollowDAO();
