const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

    certificate_hash: {
        type: String,
        unique: true,
        required: true
    },

    certificate_url: String,
    thumbnail: String,

    issue_date: { type: Date, default: Date.now },

    metadata: {
        instructor: String,
        category: String,
        level: String,
        duration: String
    }

}, { timestamps: true });

/* INDEXES */
certificateSchema.index({ certificate_hash: 1 });
certificateSchema.index({ user_id: 1 });
certificateSchema.index({ course_id: 1 });

/* VIEW (for verification page) */
certificateSchema.statics.verifyCertificate = async function (hash) {
    return this.aggregate([
        { $match: { certificate_hash: hash } },

        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" },

        {
            $lookup: {
                from: "courses",
                localField: "course_id",
                foreignField: "_id",
                as: "course"
            }
        },
        { $unwind: "$course" },

        {
            $project: {
                studentName: "$user.name",
                courseTitle: "$course.title",
                issueDate: "$issue_date",
                certificateUrl: "$certificate_url",
                thumbnail: "$thumbnail"
            }
        }
    ]);
};

module.exports = mongoose.model("Certificate", certificateSchema);