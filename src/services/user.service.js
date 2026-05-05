const userDAO = require("../dao/user.dao");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const {
  AppError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../utils/errors");
const { loginSchema, registerSchema, validate } = require("../utils/validators");
const { log } = require("../utils/logger");

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

class UserService {
  async registerUser({ name, email, password }) {
    const validatedData = validate(registerSchema, { name, email, password });

    const existingUser = await userDAO.getUserByEmail(validatedData.email);
    if (existingUser) {
      throw new BadRequestError("User already exists");
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const user = await userDAO.createUser({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    });

    log(`User registered successfully: ${user.id}`);
    return sanitizeUser(user);
  }

  async loginUser({ email, password }) {
    const validatedData = validate(loginSchema, { email, password });

    if (!JWT_SECRET) {
      throw new AppError("JWT secret is not configured", 500);
    }

    const user = await userDAO.getUserByEmail(validatedData.email);
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(validatedData.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    log(`User logged in successfully: ${user.id}`);

    return {
      token,
      user: sanitizeUser(user),
    };
  }

  async getUserById(id) {
    const user = await userDAO.getUserById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return sanitizeUser(user);
  }

  async getUserThreads(userId) {
    return userDAO.getUserThreads(userId);
  }
}

module.exports = new UserService();
