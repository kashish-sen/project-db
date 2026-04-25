const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    title: String,
    order: Number
});

sectionSchema.index({ course_id: 1, order: 1 });

module.exports = mongoose.model("Section", sectionSchema);