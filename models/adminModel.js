const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },

    password_hash: {
        type: String,
        required: true,
        minlength: 60
    },

    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AdminRole",
        required: true
    },

    status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active"
    },

    last_login: {
        type: Date
    }

}, { timestamps: true });

/* ---------------- INDEX OPTIMIZATION ---------------- */

adminSchema.index({ email: 1 });
adminSchema.index({ role: 1 });
adminSchema.index({ status: 1 });
adminSchema.index({ last_login: -1 });

module.exports = mongoose.model("Admin", adminSchema);