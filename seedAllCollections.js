const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");

/* IMPORT ALL MODELS */

const User = require("./models/userModel");
const Instructor = require("./models/instructorModel");
const Course = require("./models/courseModel");
const Module = require("./models/moduleModel");
const Lesson = require("./models/lessonModel");
const Assignment = require("./models/assignmentModel");
const Payment = require("./models/paymentModel");
const Enrollment = require("./models/enrollmentModel");
const Review = require("./models/reviewModel");
const Wishlist = require("./models/wishlistModel");

const InstructorDashboard = require("./models/instructorDashboardModel");
const InstructorRevenue = require("./models/instructorRevenueModel");
const InstructorNotification = require("./models/instructorNotificationModel");
const InstructorPayout = require("./models/instructorPayoutModel");

const CourseAnalytics = require("./models/courseAnalyticsModel");
const CourseAnnouncement = require("./models/courseAnnouncementModel");
const CourseResource = require("./models/courseResourcesModel");

const PlatformAnalytics = require("./models/platformAnalyticsModel");
const PlatformRevenue = require("./models/platformRevenueModel");

const Quiz = require("./models/quizModel");
const QuizAttempt = require("./models/quizAttemptModel");
const Progress = require("./models/progressModel");

const Certificate = require("./models/certificateModel");
const StudentAnalytics = require("./models/studentAnalyticsModel");

const Dispute = require("./models/disputesModel");
const CourseReport = require("./models/courseReportsModel");
const UserReport = require("./models/userReportsModel");

const SystemLog = require("./models/systemLogsModel");

connectDB();

async function seedAllCollections() {

try {

console.log("Seeding all collections...");

/* USER */

const user = await User.create({
user_id:"U100",
name:"Test User",
email:"test@test.com",
password_hash:"pass",
role:"student",
plan:"free",
status:"active"
});

/* INSTRUCTOR */

const instructor = await Instructor.create({
instructor_id:"I100",
instructor_name:"Test Instructor",
email:"instructor@test.com",
bio:"Demo instructor",
expertise:["Web Development"]
});

/* COURSE */

const course = await Course.create({
course_id:"C100",
title:"Demo Course",
description:"Testing course",
category:"Technology",
difficulty_level:"Beginner",
language:"English",
price:1000,
instructor_id:instructor._id,
approval_status:"approved"
});

/* MODULE */

const module = await Module.create({
module_id:"M100",
course_id:course._id,
module_title:"Introduction",
module_order:1
});

/* LESSON */

const lesson = await Lesson.create({
lesson_id:"L100",
course_id:course._id,
module_id:module._id,
lesson_title:"Welcome",
lesson_type:"video",
video_url:"https://example.com",
duration_minutes:5,
lesson_order:1
});

/* ASSIGNMENT */

await Assignment.create({
assignment_id:"A100",
course_id:course._id,
module_id:module._id,
title:"Demo Assignment",
description:"Complete task",
max_score:100
});

/* PAYMENT */

const payment = await Payment.create({
payment_id:"P100",
user_id:user._id,
course_id:course._id,
amount:1000,
currency:"INR",
status:"success"
});

/* ENROLLMENT */

await Enrollment.create({
enrollment_id:"E100",
user_id:user._id,
course_id:course._id,
status:"active"
});

/* REVIEW */

await Review.create({
review_id:"R100",
user_id:user._id,
course_id:course._id,
rating:5,
review_text:"Great course"
});

/* WISHLIST */

await Wishlist.create({
wishlist_id:"W100",
user_id:user._id,
course_id:course._id
});

/* QUIZ */

const quiz = await Quiz.create({
quiz_id:"Q100",
course_id:course._id,
module_id:module._id,
title:"Quiz 1",
questions:["What is JS?"],
options:[["Lang","DB","OS"]],
correct_answer:["Lang"],
total_questions:1,
passing_score:1
});

/* QUIZ ATTEMPT */

await QuizAttempt.create({
attempt_id:"QA100",
user_id:user._id,
quiz_id:quiz._id,
course_id:course._id,
score:1
});

/* PROGRESS */

await Progress.create({
progress_id:"PR100",
user_id:user._id,
course_id:course._id,
lesson_id:lesson._id,
completed:true
});

/* CERTIFICATE */

await Certificate.create({
certificate_id:"CERT100",
user_id:user._id,
course_id:course._id,
certificate_url:"certificate.pdf"
});

/* COURSE ANALYTICS */

await CourseAnalytics.create({
analytics_id:"CA100",
course_id:course._id,
instructor_id:instructor._id,
total_students:1,
average_rating:5
});

/* PLATFORM ANALYTICS */

await PlatformAnalytics.create({
analytics_id:"PA100",
total_users:1,
total_courses:1,
total_instructors:1
});

/* PLATFORM REVENUE */

await PlatformRevenue.create({
revenue_id:"PR100",
payment_id:payment._id,
user_id:user._id,
course_id:course._id,
instructor_id:instructor._id,
total_amount:1000,
platform_commission:200,
instructor_payout:800
});

/* SYSTEM LOG */

await SystemLog.create({
log_id:"SYS100",
action:"Seed data inserted"
});

console.log("All collections created successfully");

process.exit();

} catch(err) {

console.error(err);
process.exit(1);

}

}

seedAllCollections();