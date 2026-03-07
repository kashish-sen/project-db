const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");

const User = require("./models/userModel");
const Course = require("./models/courseModel");
const Module = require("./models/moduleModel");
const Lesson = require("./models/lessonModel");

const Enrollment = require("./models/enrollmentModel");
const Review = require("./models/reviewModel");
const Wishlist = require("./models/wishlistModel");
const Payment = require("./models/paymentModel");

const Instructor = require("./models/instructorModel");

connectDB();

const seedData = async () => {

try {

await mongoose.connection.dropDatabase();

console.log("Database cleared");


// USERS

const users = await User.insertMany([
{user_id:"U001",name:"Aarav Sharma",email:"aarav@gmail.com",password_hash:"pass"},
{user_id:"U002",name:"Riya Verma",email:"riya@gmail.com",password_hash:"pass"},
{user_id:"U003",name:"Arjun Patel",email:"arjun@gmail.com",password_hash:"pass"},
{user_id:"U004",name:"Ananya Gupta",email:"ananya@gmail.com",password_hash:"pass"},
{user_id:"U005",name:"Kabir Singh",email:"kabir@gmail.com",password_hash:"pass"}
]);

console.log("Users created");


// COURSES

const titles = [
"Full Stack Web Development",
"Python for Data Science",
"Machine Learning Basics",
"Digital Marketing",
"UI UX Design",
"Java Programming",
"React Development",
"Cyber Security",
"AWS Cloud",
"SQL Analytics"
];

const courses = [];

for(let i=0;i<10;i++){

const course = await Course.create({
course_id:`C${i+1}`,
title:titles[i],
description:"Professional online course",
category:"Technology",
difficulty_level:"Beginner",
language:"English",
price:4999,
duration_hours:40,
total_modules:3,
total_lessons:15,
rating:4.5
});

courses.push(course);

}

console.log("Courses created");


// MODULES + LESSONS

for(let course of courses){

for(let i=1;i<=3;i++){

const module = await Module.create({
module_id:`${course.course_id}_M${i}`,
course_id:course._id,
module_title:`Module ${i}`,
module_description:"Learning concepts",
module_order:i
});

for(let j=1;j<=5;j++){

await Lesson.create({
lesson_id:`${course.course_id}_M${i}_L${j}`,
course_id:course._id,
module_id:module._id,
lesson_title:`Lesson ${j}`,
video_url:"https://example.com/video",
duration_minutes:12,
lesson_order:j
});

}

}

}

console.log("Modules and Lessons created");


// ENROLLMENTS

await Enrollment.insertMany([
{enrollment_id:"E1",user_id:users[0]._id,course_id:courses[0]._id,status:"active"},
{enrollment_id:"E2",user_id:users[1]._id,course_id:courses[1]._id,status:"active"},
{enrollment_id:"E3",user_id:users[2]._id,course_id:courses[2]._id,status:"active"}
]);


// WISHLIST

await Wishlist.insertMany([
{wishlist_id:"W1",user_id:users[0]._id,course_id:courses[4]._id},
{wishlist_id:"W2",user_id:users[1]._id,course_id:courses[5]._id}
]);


// REVIEWS

await Review.insertMany([
{review_id:"R1",user_id:users[0]._id,course_id:courses[0]._id,rating:5,review_text:"Amazing course"},
{review_id:"R2",user_id:users[1]._id,course_id:courses[1]._id,rating:4,review_text:"Very helpful"}
]);


// PAYMENTS

await Payment.insertMany([
{payment_id:"P1",user_id:users[0]._id,course_id:courses[0]._id,amount:4999,currency:"INR",status:"success"},
{payment_id:"P2",user_id:users[1]._id,course_id:courses[1]._id,amount:4999,currency:"INR",status:"success"}
]);


// INSTRUCTORS

const instructors = await Instructor.insertMany([
{
instructor_id:"I001",
instructor_name:"Dr Rajesh Sharma",
email:"rajesh@edu.com",
expertise:"Web Development",
experience_years:10,
verified:true,
status:"approved"
},

{
instructor_id:"I002",
instructor_name:"Priya Mehta",
email:"priya@edu.com",
expertise:"Data Science",
experience_years:8,
verified:true,
status:"approved"
},

{
instructor_id:"I003",
instructor_name:"Amit Verma",
email:"amit@edu.com",
expertise:"Cyber Security",
experience_years:12,
verified:true,
status:"approved"
}
]);

console.log("Instructors created");

console.log("DATABASE SEEDED SUCCESSFULLY");

process.exit();

} catch(err){

console.error(err);
process.exit(1);

}

};

seedData();