import mongoose from 'mongoose';
import * as dotenv from 'dotenv'
dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9aerh.gcp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

export const connectToMongo = () => {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000
  }).then(() => console.log("Success")).catch((err) => console.log(err));
}