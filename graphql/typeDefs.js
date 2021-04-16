const { gql } = require("apollo-server");
module.exports = gql`
  type User {
    _id: String
    username: String!
    email: String
    imageUrl: String
    token: String
    createdAt: String
    latestMessage: Message
  }
  type Message {
    from: String
    to: String
    content: String
    createdAt: String
  }
  type Query {
    getUsers: [User]!
    login(username: String!, password: String!): User!
    getMessages(from: String!): [Message]!
  }
  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!

    sendMessage(content: String!, to: String!): Message!
  }

  type Subscription {
    newMessage: Message!
  }
`;
