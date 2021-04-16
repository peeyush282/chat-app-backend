const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError, AuthenticationError } = require("apollo-server-errors");
const Message = require("../../models/Message");
module.exports = {
  Query: {
    getUsers: async (_, __, { user }) => {
      console.log("fffffffffffffffffff", user);
      try {
        if (!user) throw AuthenticationError("Unauthenticated ");
        let users = await User.find({ username: { $ne: user.username } });
        let allMessageUsers;
        await Message.find({
          $or: [{ from: user.id }, { to: user.id }],
        })
          .sort({ createdAt: -1 })
          .then((alMessageUsers) => {
            allMessageUsers = alMessageUsers;
          });
        // console.log("------------", allMessageUsers);
        // console.log("============", users);
        users = users.map((otherUser) => {
          console.log(otherUser);
          let latestMessage = allMessageUsers.find(
            (m) =>
              m.from.toString() === otherUser._id.toString() ||
              m.to.toString() === otherUser._id.toString()
          );
          if (latestMessage !== undefined) {
            otherUser.latestMessage = latestMessage;
          }
          return otherUser;
        });

        return users;
      } catch (error) {
        throw error;
      }
    },
    login: async (_, args) => {
      const { username, password } = args;
      let errors = {};
      if (username.trim() === "")
        errors.username = "username must not be empty";

      if (password === "") errors.username = "password must not be empty";
      if (Object.keys(errors).length > 0) {
        throw new UserInputError("bad input", { errors });
      }
      let user;
      await User.findOne({ username: username }).then((udata) => {
        user = udata;
      });
      if (!user) {
        errors.username = "user not found";
        throw new UserInputError("user not found", { errors });
      }
      let correctPassword;
      await bcrypt.compare(password, user.password).then((result) => {
        correctPassword = result;
      });
      if (!correctPassword) {
        errors.password = "incorrect password";
        throw new UserInputError("incorrect password", { errors });
      }

      const token = jwt.sign(
        {
          username: username,
          id: user._id,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "48h" }
      );
      //   user.token = token;
      createdAt = user.createdAt.toISOString();
      console.log(user);
      return { ...user.toJSON(), token, createdAt };
    },
  },
  Mutation: {
    register: async (_, args) => {
      try {
        let { username, email, password, confirmPassword } = args;
        console.log(args);
        const userWithEmail = User.findOne({ email: email });
        const userWithUsername = User.findOne({ username: username });

        // if (userWithUsername) {
        //   return "User exits with this username";
        // }

        // if (userWithEmail) {
        //   return "User exits with this email";
        // }

        const newUser = new User();
        newUser.username = username;
        newUser.email = email;
        newUser.password = password;
        bcrypt.genSalt(10, async (err, salt) => {
          bcrypt.hash(newUser.password, salt, async (err, hash) => {
            newUser.password = hash;
            newUser.save();
          });
        });
        console.log(newUser);
        return newUser;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
