const mongoose = require("mongoose");

async function updateCourseRating(courseId){

const db = mongoose.connection.db;

const result = await db.collection("enrollments").aggregate([
{ $match:{ course_id: courseId }},
{
$group:{
_id:"$course_id",
avgRating:{ $avg:"$rating" }
}
}
]).toArray();

if(result.length>0){

await db.collection("courses").updateOne(
{ _id:courseId },
{ $set:{ rating:result[0].avgRating }}
);

}

}

module.exports = { updateCourseRating };