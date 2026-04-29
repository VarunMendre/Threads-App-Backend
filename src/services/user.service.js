const userDAO = require("../dao/user.dao");

class UserService {
  async registerUser({ name, email, password }) {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    const existingUser = await userDAO.getUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    return userDAO.createUser({
      name,
      email,
      password,
    });
  }

  async getUserById(id) {
    const user = await userDAO.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async getUserThreads(userId) {
    return userDAO.getUserThreads(userId);
  }
}

module.exports = new UserService();
