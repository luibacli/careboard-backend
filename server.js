import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import careGroupRoutes from './routes/careGroup.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined.');
}
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Authentication routes (login, register, etc.)
app.use('/api/auth', authRoutes);

app.use('/api/upload', uploadRoutes);

app.use('/api/caregroups', careGroupRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

