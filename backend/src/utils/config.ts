import dotenv from 'dotenv'

dotenv.config()

const PORT = 5000;
const MONGODB_URI = process.env.MONGODB_URI;

export default {
  PORT,
  MONGODB_URI,
};


