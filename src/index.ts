import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import mongoose, { mongo } from 'mongoose';
import authRoutes from './routes/AuthRoutes';

mongoose.connect(process.env.MONGODB_URL!)
.then(()=>console.log("DB connected"))
.catch((err)=>{
    console.error(err);
})

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Flowpost API');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
