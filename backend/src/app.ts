import config from './utils/config'
import express, { Express, Request, Response } from 'express'
import mongoose from 'mongoose'

const app: Express = express();

mongoose
  .connect(config.MONGODB_URI!)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.error("error connection to MongoDB", error.message);
  });

app.use(express.static("build"));
app.use(express.json());

// Add routes here e.g
// app.use('/api/notices', noticeBoardRouter)

export default app


