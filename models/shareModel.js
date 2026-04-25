const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema({

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

    platform: String, // whatsapp, linkedin, etc

    created_at: { type: Date, default: Date.now }

});

/* INDEX */
shareSchema.index({ course_id: 1 });
shareSchema.index({ user_id: 1 });

module.exports = mongoose.model("Share", shareSchema);