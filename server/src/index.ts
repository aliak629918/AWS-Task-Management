import express, { Application, Request, Response } from 'express';
import tasksRouter from './routes/tasks';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config()

const cors = require('cors')
const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(cors())

app.use(express.json()); 

app.use('/api', tasksRouter); 

app.use(express.static(path.join(__dirname, '../../front-end/src')));

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../front-end/src', 'App.tsx'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

