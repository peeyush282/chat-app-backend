const { ApolloServer, gql } = require("apollo-server");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
// const passport = require("passport");
dotenv.config();
require("./config/db_setting.js");

var app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "Development") {
  const morgan = require("morgan");
  app.use(morgan("combined"));
}
// The GraphQL schema
const typeDefs = require("./graphql/typeDefs");

// A map of functions which return data for the schema.
const resolvers = require("./graphql/resolvers");
const contextMidddleware = require("./utils/contextMiddleware");
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMidddleware,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
