import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        user_id: { 
            type: Number,
            required: true,
            unique: true,
        },
        username: { 
            type: String,
            required: true,
        },
        domain: { // Domain name e.g. solun.pm
            type: String,
            required: true,
        },
        fqe: { // Fully Qualified Email e.g. username@solun.pm
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: false,
        },
        active: {
            type: Boolean,
            required: true,
            default: true,
        },
        admin: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;