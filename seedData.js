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

connectDB();

const seedData = async () => {

  try {

    // 🔧 remove username index if it exists
    try {
      await mongoose.connection.collection("users").dropIndex("username_1");
      console.log("Old username index removed");
    } catch (err) {}

    // delete old data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Module.deleteMany({});
    await Lesson.deleteMany({});
    await Enrollment.deleteMany({});
    await Review.deleteMany({});
    await Wishlist.deleteMany({});
    await Payment.deleteMany({});

    console.log("Old data removed");

    // ---------------- USERS ----------------

    const users = await User.insertMany([
      {
        user_id: "U001",
        name: "Aarav Sharma",
        email: "aarav@gmail.com",
        password_hash: "pass123"
      },
      {
        user_id: "U002",
        name: "Riya Verma",
        email: "riya@gmail.com",
        password_hash: "pass123"
      },
      {
        user_id: "U003",
        name: "Arjun Patel",
        email: "arjun@gmail.com",
        password_hash: "pass123"
      },
      {
        user_id: "U004",
        name: "Ananya Gupta",
        email: "ananya@gmail.com",
        password_hash: "pass123"
      },
      {
        user_id: "U005",
        name: "Kabir Singh",
        email: "kabir@gmail.com",
        password_hash: "pass123"
      }
    ]);

    console.log("Users inserted");

    // ---------------- COURSES ----------------

    const courseTitles = [
      "Full Stack Web Development",
      "Python for Data Science",
      "Machine Learning Basics",
      "Digital Marketing Mastery",
      "UI UX Design Fundamentals",
      "Java Programming Bootcamp",
      "React Development",
      "Cyber Security Essentials",
      "Cloud Computing with AWS",
      "Data Analytics with SQL"
    ];

    const courses = [];

    for (let i = 0; i < courseTitles.length; i++) {

      const course = await Course.create({
        course_id: `C00${i + 1}`,
        title: courseTitles[i],
        description: "Professional course for beginners",
        category: "Technology",
        difficulty_level: "Beginner",
        language: "English",
        price: 4999,
        duration_hours: 40,
        total_modules: 3,
        total_lessons: 15,
        rating: 4.5,
        total_students: 0
      });

      courses.push(course);
    }

    console.log("Courses inserted");

    // ---------------- MODULES + LESSONS ----------------

    for (let course of courses) {

      for (let i = 1; i <= 3; i++) {

        const module = await Module.create({
          module_id: `${course.course_id}_M${i}`,
          course_id: course._id,
          module_title: `Module ${i}`,
          module_description: `Concepts of module ${i}`,
          module_order: i
        });

        for (let j = 1; j <= 5; j++) {

          await Lesson.create({
            lesson_id: `${course.course_id}_M${i}_L${j}`,
            course_id: course._id,
            module_id: module._id,
            lesson_title: `Lesson ${j}`,
            video_url: "https://example.com/video",
            duration_minutes: 15,
            lesson_order: j
          });

        }
      }
    }

    console.log("Modules and Lessons inserted");

    // ---------------- ENROLLMENTS ----------------

    const enrollments = [];

    for (let i = 0; i < users.length; i++) {

      enrollments.push({
        enrollment_id: `E00${i + 1}`,
        user_id: users[i]._id,
        course_id: courses[i]._id,
        completion_percentage: 25,
        status: "active"
      });

    }

    await Enrollment.insertMany(enrollments);

    console.log("Enrollments inserted");

    // ---------------- WISHLIST ----------------

    const wishlist = [];

    for (let i = 0; i < 5; i++) {

      wishlist.push({
        wishlist_id: `W00${i + 1}`,
        user_id: users[i]._id,
        course_id: courses[9 - i]._id
      });

    }

    await Wishlist.insertMany(wishlist);

    console.log("Wishlist inserted");

    // ---------------- REVIEWS ----------------

    const reviews = [];

    for (let i = 0; i < 5; i++) {

      reviews.push({
        review_id: `R00${i + 1}`,
        user_id: users[i]._id,
        course_id: courses[i]._id,
        rating: 5,
        review_text: "Excellent course with clear explanation"
      });

    }

    await Review.insertMany(reviews);

    console.log("Reviews inserted");

    // ---------------- PAYMENTS ----------------

    const payments = [];

    for (let i = 0; i < 5; i++) {

      payments.push({
        payment_id: `P00${i + 1}`,
        user_id: users[i]._id,
        course_id: courses[i]._id,
        amount: 4999,
        currency: "INR",
        payment_gateway: "Razorpay",
        transaction_id: `TXN00${i + 1}`,
        payment_method: "UPI",
        status: "success"
      });

    }

    await Payment.insertMany(payments);

    console.log("Payments inserted");

    console.log("Database seeded successfully");

    process.exit();

  } catch (error) {

    console.error(error);
    process.exit(1);

  }

};

seedData();