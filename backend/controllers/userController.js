import User from '../models/User.js';
import Flag from '../models/Flag.js';
import mongoose from 'mongoose';


export const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Only 'user' or 'admin' roles can be created" });
    }

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "User already exists" });
        }

        const newUser = new User({
            name,
            email,
            password,
            role,
            createdBy: req.user.id
        });

        await newUser.save();

        res.status(201).json({ message: `${role} created successfully` });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getAllUsers = async (req, res) => {
    const { role } = req.query;

    try {
        const query = {};
        if (role) query.role = role;

        const users = await User.find(query).select("-password"); // hide passwords
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.role === 'superadmin') {
            return res.status(403).json({ message: "Cannot delete superadmin" });
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

export const flagContent = async (req, res) => {
    const { itemId, reason } = req.body;


    if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ message: "Valid itemId is required." });
    }
    if (!reason || reason.trim().length < 3) {
        return res.status(400).json({ message: "Reason is required" });
    }

    try {
        const flag = await Flag.create({
            itemId,
            reason,
            flaggedBy: req.user.id
        });

        res.status(201).json({ message: "Flag submitted", flag });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit flag", error: error.message });
    }
};