const threadDAO = require("../dao/thread.dao");
const userDAO = require("../dao/user.dao");

class ThreadService {
  async createThread({ title, content, authorId }) {
    if (!title || !content) {
      throw new Error("Title and content are required");
    }

    const user = await userDAO.getUserById(authorId);
    if (!user) {
      throw new Error("Author not found");
    }

    return threadDAO.createThread({
      title,
      content,
      authorId,
    });
  }

  async getAllThreads() {
    return threadDAO.getAllThreads();
  }

  async getThreadById(id) {
    const thread = await threadDAO.getThreadById(id);
    if (!thread) {
      throw new Error("Thread not found");
    }

    return thread;
  }
}

module.exports = new ThreadService();
