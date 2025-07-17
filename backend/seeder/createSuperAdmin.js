import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();
await connectDB();

const seedSuperAdmin = async () => {
    try {
        const existing = await User.findOne({ role: 'superadmin' });
        if (existing) {
            console.log('Superadmin already exists:', existing.email);
            process.exit(0);
        }


        const superadmin = await User.create({
            name: 'Super Admin',
            email: 'superadmin@example.com',
            password: 'Superadmin@12',
            role: 'superadmin',
            createdBy: null
        });

        process.exit(0);
    } catch (error) {
        console.error('Failed to seed superadmin:', error.message);
        process.exit(1);
    }
};

seedSuperAdmin();
