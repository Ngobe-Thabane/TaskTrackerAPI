import { config } from 'dotenv';
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/AuthRoutes.js'
import todoRoutes from './routes/TodoRoutes.js';

config({path:'./configs/.env'})

const app = express();

app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(todoRoutes);

app.listen(process.env.PORT, ()=>{
  console.log(`Server running on port ${process.env.PORT}`);
})

