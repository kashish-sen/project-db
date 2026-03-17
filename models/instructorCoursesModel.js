const mongoose = require("mongoose");

const instructorCoursesSchema = new mongoose.Schema({

  instructor_course_id: String,

  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor"
  },

  instructor_name: String,

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  course_title: String,

  created_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("InstructorCourse", instructorCoursesSchema);


/* =====================================================
Index Optimization
===================================================== */

// Index for instructor lookup
instructorCoursesSchema.index({ instructor_id: 1 });

// Index for course lookup
instructorCoursesSchema.index({ course_id: 1 });

// Compound index for instructor + course queries
instructorCoursesSchema.index({ instructor_id: 1, course_id: 1 });

// Index for sorting by creation date
instructorCoursesSchema.index({ created_at: -1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index only documents that contain instructor_name
instructorCoursesSchema.index(
  { instructor_name: 1 },
  { partialFilterExpression: { instructor_name: { $exists: true } } }
);

// Index only documents that contain course_title
instructorCoursesSchema.index(
  { course_title: 1 },
  { partialFilterExpression: { course_title: { $exists: true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get courses assigned to an instructor
instructorCoursesSchema.statics.getCoursesByInstructor = function(instructorId) {
  return this.find({ instructor_id: instructorId });
};

// Get instructor for a course
instructorCoursesSchema.statics.getInstructorByCourse = function(courseId) {
  return this.find({ course_id: courseId });
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: number of courses per instructor
instructorCoursesSchema.statics.coursesPerInstructorView = function() {
  return this.aggregate([
    {
      $group: {
        _id: "$instructor_id",
        instructor_name: { $first: "$instructor_name" },
        total_courses: { $sum: 1 }
      }
    },
    {
      $sort: { total_courses: -1 }
    }
  ]);
};