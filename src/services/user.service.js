const userDAO = require("../dao/user.dao");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

class UserService {
  async registerUser({ name, email, password }) {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    const existingUser = await userDAO.getUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return userDAO.createUser({
      name,
      email,
      password: hashedPassword,
    });
  }

  async loginUser({ email, password }) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    if (!JWT_SECRET) {
      throw new Error("JWT secret is not configured");
    }

    const user = await userDAO.getUserByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return {
      token,
      user,
    };
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
