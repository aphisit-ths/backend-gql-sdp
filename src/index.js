import server from "./server";
import mongoose from "mongoose";
const express = require("express");
import dotenv from 'dotenv'

dotenv.config()
//Strart  Server

const {DB_NAME,DB_PASSWORD,DB_USER,PORT} = process.env

const createServer = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@graphql-101.grzjp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
      { useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true}
      ,
    );
    const app = express();
    await server.start();
    server.applyMiddleware({ app });
    app.listen({ port: PORT }, () =>
      console.log(
        `server ready at http://localhost:${PORT}${server.graphqlPath}`
      )
    );
  } catch (error) {
    console.log(error);
  }
};

createServer();
