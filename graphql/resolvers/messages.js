const User = require("../../models/User");
const {
  UserInputError,
  AuthenticationError,
  withFilter,
} = require("apollo-server");
const Message = require("../../models/Message");
module.exports = {
  Query: {
    getMessages: async (_, { from }, { user }) => {
      // console.log(user);
      if (!user) throw new AuthenticationError("Unauthenticated");
      let otherUser;
      await User.findOne({ _id: from }).then(async (fuser) => {
        // console.log(fuser);
        if (!fuser) throw new UserInputError("user not found");
        otherUser = fuser;
      });
      console.log(otherUser);
      const messages = await Message.find({
        $or: [
          { $and: [{ from: user.id }, { to: otherUser._id }] },
          { $and: [{ from: otherUser._id }, { to: user.id }] },
        ],
      }).sort({ createdAt: -1 });
      console.log(messages);
      return messages;
    },
  },
  Mutation: {
    sendMessage: async (_, args, { user, pubsub }) => {
      try {
        const { content, to } = args;
        if (!user) throw new AuthenticationError("Unauthenticated");
        await User.findOne({ _id: to }).then((fuser) => {
          if (!fuser) throw new UserInputError("user not found");
          if (fuser.username === user.username)
            throw new UserInputError("you can't message to yourself");
        });

        if (content.trim() === "") {
          throw new UserInputError("Message is empty");
        }
        const newMsg = new Message();
        newMsg.content = content;
        newMsg.from = user.id;
        newMsg.to = to;
        await newMsg.save();
        let createdAt = newMsg.createdAt.toISOString();
        pubsub.publish("NEW_MESSAGE", {
          newMessage: { ...newMsg.toJSON(), createdAt },
        });
        return { ...newMsg.toJSON(), createdAt };
      } catch (error) {
        console.log(error);
      }
    },
  },

  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub }) => {
          if (!user) throw new AuthenticationError("Unauthenticated");
          return pubsub.asyncIterator(["NEW_MESSAGE"]);
        },
        ({ newMessage }, _, { user }) => {
          console.log(
            newMessage.from.toString() === user.id.toString() ||
              newMessage.to.toString() === user.id.toString()
          );
          console.log(newMessage.from, newMessage.to, user.id);
          if (
            newMessage.from.toString() === user.id.toString() ||
            newMessage.to.toString() === user.id.toString()
          ) {
            console.log("44444444444444444444444444444444");
            return true;
          }
          return false;
        }
      ),
    },
  },
};
