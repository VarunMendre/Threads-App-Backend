const userResolver = require("./user.resolver");
const threadResolver = require("./thread.resolver");

module.exports = {
  Query: {
    ...userResolver.Query,
    ...threadResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...threadResolver.Mutation,
  },
  User: {
    ...userResolver.User,
  },
  Thread: {
    ...threadResolver.Thread,
  },
};
