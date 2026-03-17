const mongoose = require("mongoose");

async function createViews(){

const db = mongoose.connection.db;

await db.createCollection("top_courses_view",{
viewOn:"courses",
pipeline:[
{ $match:{ approval_status:"approved" }},
{ $sort:{ rating:-1,total_students:-1 }},
{
$project:{
title:1,
category:1,
rating:1,
total_students:1
}
}
]
});

await db.createCollection("instructor_course_summary_view",{
viewOn:"courses",
pipeline:[
{
$group:{
_id:"$instructor_id",
total_courses:{ $sum:1 },
avg_rating:{ $avg:"$rating" },
total_students:{ $sum:"$total_students" }
}
}
]
});

await db.createCollection("student_enrollment_summary_view",{
viewOn:"enrollments",
pipeline:[
{
$group:{
_id:"$user_id",
courses_enrolled:{ $sum:1 }
}
}
]
});

console.log("Database Views Created");

}

module.exports = createViews;