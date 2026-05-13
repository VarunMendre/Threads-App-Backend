const DataLoader = require("dataloader");
const prisma = require("../config/prisma");

async function batchUsers(userIds) {
  // DataLoader can ask for the same id multiple times in one request.
  // We dedupe before hitting the database, then restore original order below.
  const uniqueUserIds = [...new Set(userIds)];

  const users = await prisma.user.findMany({
    where: {
      id: { in: uniqueUserIds },
    },
  });

  const userMap = new Map(users.map((user) => [user.id, user]));

  // DataLoader requires results in the exact same order as incoming keys.
  return userIds.map((id) => userMap.get(id) || null);
}

function createUserLoader() {
  return new DataLoader(batchUsers);
}

module.exports = createUserLoader;
