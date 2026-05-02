const followDAO = require("../dao/follow.dao");
const userDAO = require("../dao/user.dao");

class FollowService {
  async followUser(followerId, followingId) {
    if (followerId === followingId) {
      throw new Error("Cannot follow yourself");
    }

    const follower = await userDAO.getUserById(followerId);
    if (!follower) {
      throw new Error("Follower not found");
    }

    const following = await userDAO.getUserById(followingId);
    if (!following) {
      throw new Error("User to follow not found");
    }

    return followDAO.followUser(followerId, followingId);
  }

  async unfollowUser(followerId, followingId) {
    return followDAO.unfollowUser(followerId, followingId);
  }
}

module.exports = new FollowService();
