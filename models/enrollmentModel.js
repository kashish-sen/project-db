const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

    progress: { type: Number, default: 0 },

    last_accessed: Date,

    completed: { type: Boolean, default: false },

    enrolled_at: { type: Date, default: Date.now }

});

/* INDEX */
enrollmentSchema.index({ user_id: 1, course_id: 1 });
enrollmentSchema.index({ course_id: 1 });

/* VIEW */
enrollmentSchema.statics.getInstructorStudents = function (instructorId) {
    return this.aggregate([
        {
            $lookup: {
                from: "courses",
                localField: "course_id",
                foreignField: "_id",
                as: "course"
            }
        },
        { $unwind: "$course" },
        { $match: { "course.instructor_id": instructorId } },

        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "student"
            }
        },
        { $unwind: "$student" }
    ]);
};

module.exports = mongoose.model("Enrollment", enrollmentSchema);