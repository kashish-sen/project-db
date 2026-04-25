const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({

    section_id: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },

    title: String,

    type: {
        type: String,
        enum: ["video", "notes", "quiz"]
    },

    youtubeUrl: String,
    description: String,

    isPreview: Boolean,

    duration: String,

    order: Number

});

lessonSchema.index({ section_id: 1, order: 1 });

module.exports = mongoose.model("Lesson", lessonSchema);