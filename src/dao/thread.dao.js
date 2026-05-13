const prisma = require("../config/prisma");

class ThreadDAO {
  async getAllThreads() {
    return prisma.thread.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getPaginatedThreads(limit, cursor) {
    let where;

    if (cursor) {
      // Cursor pagination here is based on a stable sort:
      // newest createdAt first, and id as a tie-breaker when timestamps match.
      const cursorThread = await prisma.thread.findUnique({
        where: { id: cursor },
        select: {
          id: true,
          createdAt: true,
        },
      });

      if (!cursorThread) {
        return [];
      }

      // Fetch rows "after" the cursor in descending order.
      // For identical timestamps we compare ids so pagination stays deterministic.
      where = {
        OR: [
          { createdAt: { lt: cursorThread.createdAt } },
          {
            createdAt: cursorThread.createdAt,
            id: { lt: cursorThread.id },
          },
        ],
      };
    }

    return prisma.thread.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        createdAt: true,
      },
      where,
      // One extra row lets the service compute nextCursor / hasMore.
      take: limit + 1,
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" },
      ],
    });
  }

  async getThreadById(id) {
    return prisma.thread.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        createdAt: true,
      },
    });
  }

  async createThread(data) {
    return prisma.thread.create({
      data,
    });
  }

  async deleteThread(id) {
    return prisma.thread.delete({
      where: { id },
    });
  }
}

module.exports = new ThreadDAO();
