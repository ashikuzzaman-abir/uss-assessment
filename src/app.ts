import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './db';

//importing routes
import userRoutes from './routes/user.route';
import errorHandler from './middlewares/errorHandler';

//importing controller
import infoController from './controllers/info/info.controller';
import createUser from './controllers/user/createUser.controller';
import login from './controllers/auth/login.controller';

//importing middlewares
import { protect } from './middlewares/auth';

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

// connect to MongoDB
connectDB();

//Setting up neccessary middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));

// routes
app.get('/', (req, res, next) => {
  return res.send('Hello, Node.js!');
});

// Candidate Info route
app.get('/api/info', infoController);

//Auth routes
app.post('/api/register', createUser);
app.post('/api/login', login);
// Protected routes
app.use('/api/users', protect, userRoutes);

// testing the global error handler
app.get('/error', (req, res, next) => {
  next(new Error('This is an error message'));
});

/// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
