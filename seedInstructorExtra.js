require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = require("./config/db");

async function seedInstructorExtra(){

try{

await connectDB();

const db = mongoose.connection.db;

const instructor = await db.collection("instructors").findOne({});
const course = await db.collection("courses").findOne({});
const user = await db.collection("users").findOne({});

/* COURSE ANALYTICS */

await db.collection("courseanalytics").insertOne({

analytics_id:"CA001",
instructor_id:instructor._id,
course_id:course._id,
total_students:200,
average_rating:4.8,
completion_rate:72,
total_revenue:400000,
updated_at:new Date()

});

/* STUDENT ANALYTICS */

await db.collection("studentanalytics").insertOne({

analytics_id:"SA001",
instructor_id:instructor._id,
course_id:course._id,
user_id:user._id,
progress_percentage:65,
quiz_score:88

});

console.log("Instructor analytics inserted");

process.exit();

}catch(error){

console.error(error);
process.exit(1);

}

}

seedInstructorExtra();