const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({

    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

    title: String,

    content: String,

    created_at: { type: Date, default: Date.now }

});

announcementSchema.index({ course_id: 1 });

module.exports = mongoose.model("Announcement", announcementSchema);