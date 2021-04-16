const userResolver = require("../resolvers/users");
const messageResolver = require("../resolvers/messages");

module.exports = {
  // Message: {
  //   createdAt: (parent) => parent.createdAt.toISOString(),
  // },
  // User: {
  //   createdAt: (parent) => parent.createdAt.toISOString(),
  // },
  Query: {
    ...userResolver.Query,
    ...messageResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...messageResolver.Mutation,
  },
  Subscription: {
    ...messageResolver.Subscription,
  },
};
