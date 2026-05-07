const threadDAO = require("../dao/thread.dao");
const userDAO = require("../dao/user.dao");
const { NotFoundError } = require("../utils/errors");
const { threadSchema, paginationSchema, validate } = require("../utils/validators");

class ThreadService {
  async createThread({ title, content, authorId }) {
    const validatedData = validate(threadSchema, { title, content });

    const user = await userDAO.getUserById(authorId);
    if (!user) {
      throw new NotFoundError("Author not found");
    }

    return threadDAO.createThread({
      title: validatedData.title,
      content: validatedData.content,
      authorId,
    });
  }

  async getAllThreads() {
    return threadDAO.getAllThreads();
  }

  async getThreads({ limit, cursor }) {
    const validatedData = validate(paginationSchema, { limit, cursor });
    const paginatedThreads = await threadDAO.getPaginatedThreads(
      validatedData.limit,
      validatedData.cursor
    );
    const hasMore = paginatedThreads.length > validatedData.limit;
    const threads = hasMore
      ? paginatedThreads.slice(0, validatedData.limit)
      : paginatedThreads;
    const nextCursor = hasMore ? threads[threads.length - 1].id : null;

    return { threads, nextCursor };
  }

  async getThreadById(id) {
    const thread = await threadDAO.getThreadById(id);
    if (!thread) {
      throw new NotFoundError("Thread not found");
    }

    return thread;
  }
}

module.exports = new ThreadService();
