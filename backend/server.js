import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
// route
import authRoutes from './routes/authRoutes.js';
import superadminRoutes from './routes/superadminRoutes.js';
import approvalRoutes from './routes/approvalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import logRoutes from './routes/logRoutes.js';

// Load environment variables
dotenv.config();

// Connect to DB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // Allow cookies to be sent with requests
}));
app.use(express.json());


// Default route
app.get('/', (req, res) => {
    res.send('Admin Approval Engine API is running...');
});

// route
app.use('/api/auth', authRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/admin', approvalRoutes);
app.use('/api/user', userRoutes);
app.use('/api/logs', logRoutes);

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
