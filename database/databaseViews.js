const mongoose = require("mongoose");

const User = require("../models/userModel");
const Course = require("../models/courseModel");
const Enrollment = require("../models/enrollmentModel");
const Payment = require("../models/paymentModel");
const Certificate = require("../models/certificateModel");
const QA = require("../models/qaModel");

/* =====================================================
1. ADMIN DASHBOARD VIEW
===================================================== */
exports.getAdminDashboard = async () => {
    return User.aggregate([
        {
            $facet: {
                users: [{ $count: "totalUsers" }],
                instructors: [
                    { $match: { role: "instructor" } },
                    { $count: "totalInstructors" }
                ],
                students: [
                    { $match: { role: "student" } },
                    { $count: "totalStudents" }
                ],
                courses: [
                    {
                        $lookup: {
                            from: "courses",
                            pipeline: [],
                            as: "courses"
                        }
                    },
                    {
                        $project: {
                            totalCourses: { $size: "$courses" }
                        }
                    }
                ],
                revenue: [
                    {
                        $lookup: {
                            from: "payments",
                            pipeline: [
                                { $match: { status: "completed" } }
                            ],
                            as: "payments"
                        }
                    },
                    {
                        $project: {
                            totalRevenue: {
                                $sum: "$payments.amount"
                            }
                        }
                    }
                ]
            }
        }
    ]);
};


/* =====================================================
2. INSTRUCTOR DASHBOARD VIEW
===================================================== */
exports.getInstructorDashboard = async (instructorId) => {

    return Course.aggregate([
        {
            $match: {
                instructor_id: new mongoose.Types.ObjectId(instructorId)
            }
        },

        {
            $lookup: {
                from: "enrollments",
                localField: "_id",
                foreignField: "course_id",
                as: "students"
            }
        },

        {
            $lookup: {
                from: "payments",
                localField: "_id",
                foreignField: "course_id",
                as: "payments"
            }
        },

        {
            $project: {
                title: 1,
                studentsCount: { $size: "$students" },
                revenue: { $sum: "$payments.amount" },
                rating: 1
            }
        }
    ]);
};


/* =====================================================
3. STUDENT DASHBOARD VIEW
===================================================== */
exports.getStudentDashboard = async (userId) => {

    return Enrollment.aggregate([
        {
            $match: {
                user_id: new mongoose.Types.ObjectId(userId)
            }
        },

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
                courseTitle: "$course.title",
                progress: 1,
                completed: 1,
                last_accessed: 1
            }
        }
    ]);
};


/* =====================================================
4. COURSE DETAILS VIEW (FULL PAGE)
===================================================== */
exports.getCourseFullDetails = async (courseId) => {

    return Course.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(courseId) }
        },

        {
            $lookup: {
                from: "users",
                localField: "instructor_id",
                foreignField: "_id",
                as: "instructor"
            }
        },
        { $unwind: "$instructor" },

        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "course_id",
                as: "reviews"
            }
        },

        {
            $lookup: {
                from: "enrollments",
                localField: "_id",
                foreignField: "course_id",
                as: "students"
            }
        },

        {
            $project: {
                title: 1,
                description: 1,
                instructor: "$instructor.name",
                rating: 1,
                totalStudents: { $size: "$students" },
                reviews: 1
            }
        }
    ]);
};


/* =====================================================
5. CERTIFICATE VERIFICATION VIEW
===================================================== */
exports.verifyCertificate = async (hash) => {

    return Certificate.aggregate([
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
                certificateUrl: "$certificate_url"
            }
        }
    ]);
};


/* =====================================================
6. Q&A VIEW (COURSE DISCUSSIONS)
===================================================== */
exports.getCourseQA = async (courseId) => {

    return QA.aggregate([
        {
            $match: { course_id: new mongoose.Types.ObjectId(courseId) }
        },

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
            $project: {
                title: 1,
                content: 1,
                userName: "$user.name",
                replies: { $size: "$replies" },
                created_at: 1
            }
        }
    ]);
};


/* =====================================================
7. ORDER HISTORY VIEW
===================================================== */
exports.getOrderHistory = async (userId) => {

    return Payment.aggregate([
        {
            $match: { user_id: new mongoose.Types.ObjectId(userId) }
        },

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
                courseTitle: "$course.title",
                amount: 1,
                status: 1,
                created_at: 1
            }
        }
    ]);
};