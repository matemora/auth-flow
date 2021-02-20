import express from 'express';
import cors from 'cors';
import routes from './routes';
import { connectToMongo } from './database/connection';

const app = express();

connectToMongo();

app.use(cors({
  origin: '*',
}));
app.use(express.json());
app.use(routes);

app.listen(3333);