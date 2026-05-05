const followDAO = require("../dao/follow.dao");
const userDAO = require("../dao/user.dao");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class FollowService {
  async followUser(followerId, followingId) {
    if (followerId === followingId) {
      throw new BadRequestError("Cannot follow yourself");
    }

    const follower = await userDAO.getUserById(followerId);
    if (!follower) {
      throw new NotFoundError("Follower not found");
    }

    const following = await userDAO.getUserById(followingId);
    if (!following) {
      throw new NotFoundError("User to follow not found");
    }

    const existingFollow = await followDAO.getFollow(followerId, followingId);
    if (existingFollow) {
      throw new BadRequestError("You are already following this user");
    }

    return followDAO.followUser(followerId, followingId);
  }

  async unfollowUser(followerId, followingId) {
    const existingFollow = await followDAO.getFollow(followerId, followingId);
    if (!existingFollow) {
      throw new NotFoundError("Follow relationship not found");
    }

    return followDAO.unfollowUser(followerId, followingId);
  }
}

module.exports = new FollowService();
