const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
    institution: String,
    degree: String,
    field: String,
    startYear: String,
    endYear: String,
    current: Boolean
}, { _id: false });

const workSchema = new mongoose.Schema({
    company: String,
    role: String,
    startYear: String,
    endYear: String,
    current: Boolean
}, { _id: false });

const userSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: String,

    role: {
        type: String,
        enum: ["student", "instructor", "admin"],
        index: true
    },

    avatar: String,
    bio: String,

    expertise: String, // instructor signup

    education: [educationSchema],
    workExperience: [workSchema],

    skills: [String],

    status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active"
    },

    last_login: Date

}, { timestamps: true });

/* INDEXES */
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ name: "text", bio: "text" });

/* VIEW */
userSchema.statics.getPublicProfile = function (userId) {
    return this.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(userId) } },
        {
            $project: {
                name: 1,
                avatar: 1,
                bio: 1,
                education: 1,
                workExperience: 1,
                skills: 1
            }
        }
    ]);
};

module.exports = mongoose.model("User", userSchema);