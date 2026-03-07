require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = require("./config/db");

async function seedInstructorExtra() {

try {

await connectDB();

const db = mongoose.connection.db;

console.log("MongoDB Connected");


// FETCH EXISTING DOCUMENTS

const instructor = await db.collection("instructors").findOne({});
const course = await db.collection("courses").findOne({});
const user = await db.collection("users").findOne({});

if (!instructor || !course || !user) {

console.log("Required base data missing (users/courses/instructors)");
process.exit();

}


// COURSE ANALYTICS

await db.collection("courseanalytics").insertOne({

analytics_id: "CA001",

instructor_id: instructor._id,

course_id: course._id,

total_students: 200,

average_rating: 4.8,

completion_rate: 72,

total_revenue: 400000,

total_lessons: 15,

total_modules: 3,

updated_at: new Date()

});


// STUDENT ANALYTICS

await db.collection("studentanalytics").insertOne({

analytics_id: "SA001",

instructor_id: instructor._id,

course_id: course._id,

user_id: user._id,

user_name: "Aarav Sharma",

progress_percentage: 65,

quiz_score: 88,

lessons_completed: 10,

last_active: new Date()

});


// INSTRUCTOR REVENUE

await db.collection("instructorrevenue").insertOne({

revenue_id: "REV001",

instructor_id: instructor._id,

instructor_name: "Dr Rajesh Sharma",

course_id: course._id,

total_amount: 4999,

platform_commission: 999,

instructor_earning: 4000,

currency: "INR",

created_at: new Date()

});


// INSTRUCTOR DASHBOARD

await db.collection("instructordashboard").insertOne({

dashboard_id: "D001",

instructor_id: instructor._id,

total_courses: 3,

total_students: 500,

total_revenue: 900000,

average_rating: 4.8,

total_lessons: 45,

total_modules: 9,

total_quizzes: 9,

last_updated: new Date()

});


// COURSE ANNOUNCEMENTS

await db.collection("courseannouncements").insertOne({

announcement_id: "ANN001",

instructor_id: instructor._id,

course_id: course._id,

title: "New Lesson Added",

message: "Advanced React lesson released",

created_at: new Date()

});


// COURSE RESOURCES

await db.collection("courseresources").insertOne({

resource_id: "RES001",

instructor_id: instructor._id,

course_id: course._id,

resource_title: "React Cheat Sheet",

file_url: "react_cheatsheet.pdf",

file_type: "PDF",

uploaded_at: new Date()

});


// INSTRUCTOR NOTIFICATIONS

await db.collection("instructornotifications").insertOne({

notification_id: "NOT001",

instructor_id: instructor._id,

message: "Your course reached 500 students",

read_status: false,

created_at: new Date()

});


// INSTRUCTOR PAYOUTS

await db.collection("instructorpayouts").insertOne({

payout_id: "PO001",

instructor_id: instructor._id,

instructor_name: "Dr Rajesh Sharma",

amount: 300000,

currency: "INR",

payment_method: "Bank Transfer",

transaction_id: "BANKTXN123",

status: "processed",

requested_at: new Date(),

processed_at: new Date()

});

console.log("Instructor portal tables populated successfully");

process.exit();

}

catch(error){

console.error("Error:", error);

process.exit();

}

}

seedInstructorExtra();