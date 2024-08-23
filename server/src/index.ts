import express, { Application, Request, Response } from 'express';
import tasksRouter from './routes/tasks';
import * as dotenv from 'dotenv';
dotenv.config()

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use('/api', tasksRouter); // Use the tasks router under the /api path

app.use(express.json()); // This allows your server to parse JSON in the request body

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
