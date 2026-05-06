const DataLoader = require("dataloader");
const prisma = require("../config/prisma");

async function batchUsers(userIds) {
  const uniqueUserIds = [...new Set(userIds)];

  const users = await prisma.user.findMany({
    where: {
      id: { in: uniqueUserIds },
    },
  });

  const userMap = new Map(users.map((user) => [user.id, user]));

  return userIds.map((id) => userMap.get(id) || null);
}

function createUserLoader() {
  return new DataLoader(batchUsers);
}

module.exports = createUserLoader;
