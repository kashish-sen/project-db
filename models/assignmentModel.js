const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({

    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

    title: String,
    description: String,

    due_date: Date,

    max_score: Number

});

const submissionSchema = new mongoose.Schema({

    assignment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    submission_url: String,

    submitted_at: Date,

    grade: String

});

/* INDEX */
submissionSchema.index({ user_id: 1 });
submissionSchema.index({ assignment_id: 1 });

module.exports = {
    Assignment: mongoose.model("Assignment", assignmentSchema),
    Submission: mongoose.model("Submission", submissionSchema)
};