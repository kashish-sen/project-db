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

/* USERS */

const users = await User.insertMany([

{
user_id:"U001",
name:"Aarav Sharma",
email:"aarav@gmail.com",
password_hash:"pass",
role:"student",
plan:"free",
status:"active"
},

{
user_id:"U002",
name:"Riya Verma",
email:"riya@gmail.com",
password_hash:"pass",
role:"student",
plan:"pro",
status:"active"
},

{
user_id:"U003",
name:"Arjun Patel",
email:"arjun@gmail.com",
password_hash:"pass",
role:"student",
plan:"free",
status:"inactive"
}

]);

console.log("Users inserted");

/* INSTRUCTORS */

const instructors = await Instructor.insertMany([

{
instructor_id:"I001",
instructor_name:"Dr Rajesh Sharma",
email:"rajesh@edu.com",
bio:"Expert web development instructor",
expertise:["Web Development"]
},

{
instructor_id:"I002",
instructor_name:"Priya Mehta",
email:"priya@edu.com",
bio:"Data science mentor",
expertise:["Data Science"]
}

]);

console.log("Instructors inserted");

/* COURSES */

const course = await Course.create({

course_id:"C001",
title:"Full Stack Web Development",
description:"Complete development course",
category:"Technology",
difficulty_level:"Beginner",
language:"English",
price:4999,
instructor_id:instructors[0]._id,
approval_status:"approved"

});

console.log("Course inserted");

/* MODULE */

const module = await Module.create({

module_id:"M001",
course_id:course._id,
module_title:"Introduction",
module_order:1

});

/* LESSON */

await Lesson.create({

lesson_id:"L001",
course_id:course._id,
module_id:module._id,
lesson_title:"Welcome Lesson",
lesson_type:"video",
video_url:"https://example.com/video",
duration_minutes:10,
lesson_order:1

});

console.log("Module and Lesson inserted");

process.exit();

} catch (error){

console.error(error);
process.exit(1);

}

};

seedData();