const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");

const User = require("./models/userModel");
const Course = require("./models/courseModel");
const Instructor = require("./models/instructorModel");

connectDB();

const seedFullData = async () => {

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
}

]);

/* INSTRUCTORS */

const instructors = await Instructor.insertMany([

{
instructor_id:"I001",
instructor_name:"Dr Rajesh Sharma",
email:"rajesh@edu.com",
bio:"Web developer",
expertise:["Web Development"]
}

]);

/* COURSES */

await Course.insertMany([

{
course_id:"C001",
title:"Full Stack Web Development",
description:"Learn web development",
category:"Technology",
difficulty_level:"Beginner",
language:"English",
price:4999,
instructor_id:instructors[0]._id,
approval_status:"pending"
}

]);

console.log("Full seed completed");

process.exit();

}catch(err){

console.error(err);
process.exit(1);

}

};

seedFullData();