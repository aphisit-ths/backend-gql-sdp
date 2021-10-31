import server from "./server";
import mongoose from "mongoose";
const express = require("express");
import dotenv from 'dotenv'

dotenv.config()
//Strart  Server
const PORT = process.env.PORT || 4444
const DATABASE_URL= process.env.DATABASE_URL

const createServer = async () => {
  try {
    await mongoose.connect(
      DATABASE_URL,
      { useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true}
      ,
    );
    const app = express();
    await server.start();
    server.applyMiddleware({ app });
    
    app.get("/",(req ,res) =>{
      res.json({result:"ok"})
    })

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
