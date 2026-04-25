const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({

    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },

    questions: [
        {
            question: String,
            explanation: String,
            options: [
                {
                    text: String,
                    isCorrect: Boolean
                }
            ]
        }
    ],

    duration: Number

});

quizSchema.index({ lesson_id: 1 });

module.exports = mongoose.model("Quiz", quizSchema);