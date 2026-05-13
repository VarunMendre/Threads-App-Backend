const threadDAO = require("../dao/thread.dao");
const userDAO = require("../dao/user.dao");
const { NotFoundError } = require("../utils/errors");
const { threadSchema, paginationSchema, validate } = require("../utils/validators");

class ThreadService {
  async createThread({ title, content, authorId }) {
    // Step 1: validate raw input coming from GraphQL args.
    const validatedData = validate(threadSchema, { title, content });

    // Step 2: verify referenced records before writing.
    const user = await userDAO.getUserById(authorId);
    if (!user) {
      throw new NotFoundError("Author not found");
    }

    // Step 3: delegate persistence to the DAO.
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

    // The DAO fetches one extra row so the service can answer:
    // "is there another page after this one?"
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
