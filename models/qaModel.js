const mongoose = require("mongoose");

const qaSchema = new mongoose.Schema({

    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    title: String,
    content: String,

    replies: [
        {
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            message: String,
            isInstructor: Boolean,
            created_at: { type: Date, default: Date.now }
        }
    ],

    created_at: { type: Date, default: Date.now }

});

/* INDEX */
qaSchema.index({ course_id: 1 });
qaSchema.index({ user_id: 1 });

module.exports = mongoose.model("QA", qaSchema);