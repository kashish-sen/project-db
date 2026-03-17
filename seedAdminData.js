const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");

const Admin = require("./models/adminModel");
const AdminRole = require("./models/adminRolesModel");
const AdminUserAction = require("./models/adminUserActionsModel");
const CourseApprovalQueue = require("./models/courseApprovalQueueModel");

const User = require("./models/userModel");
const Course = require("./models/courseModel");
const Instructor = require("./models/instructorModel");

connectDB();

const seedAdminData = async () => {
  try {

    console.log("Clearing old admin data...");

    await Admin.deleteMany({});
    await AdminRole.deleteMany({});
    await AdminUserAction.deleteMany({});
    await CourseApprovalQueue.deleteMany({});

    console.log("Old admin data removed");


    /* FETCH EXISTING DATA */

    const users = await User.find();
    const courses = await Course.find();
    const instructors = await Instructor.find();


    /* ADMIN ROLES */

    const roles = await AdminRole.insertMany([
      {
        role_id: "AR001",
        role_name: "Super Admin",
        permissions: [
          "manage_users",
          "approve_courses",
          "view_analytics"
        ]
      },
      {
        role_id: "AR002",
        role_name: "Moderator",
        permissions: [
          "review_courses"
        ]
      }
    ]);

    console.log("Admin roles created");


    /* ADMINS */

    const admins = await Admin.insertMany([
      {
        admin_id: "A001",
        admin_name: "Rahul Khanna",
        email: "rahul.admin@platform.com",
        password_hash: "admin123",
        role: roles[0]._id
      },
      {
        admin_id: "A002",
        admin_name: "Neha Kapoor",
        email: "neha.admin@platform.com",
        password_hash: "admin123",
        role: roles[1]._id
      }
    ]);

    console.log("Admins created");


    /* ADMIN USER ACTIONS */

    const adminActions = [];

    if (users.length > 0) {
      adminActions.push({
        action_id: "ACT001",
        admin_id: admins[0]._id,
        user_id: users[0]._id,
        action: "activate",
        old_status: "inactive",
        new_status: "active"
      });
    }

    if (users.length > 1) {
      adminActions.push({
        action_id: "ACT002",
        admin_id: admins[0]._id,
        user_id: users[1]._id,
        action: "suspend",
        old_status: "active",
        new_status: "suspended"
      });
    }

    if (adminActions.length > 0) {
      await AdminUserAction.insertMany(adminActions);
    }

    console.log("Admin actions created");


    /* COURSE APPROVAL QUEUE */

    const approvalData = [];

    if (courses.length > 0 && instructors.length > 0) {
      approvalData.push({
        approval_id: "APP001",
        course_id: courses[0]._id,
        instructor_id: instructors[0]._id,
        status: "approved",
        review_notes: "Course meets platform standards",
        reviewed_by: admins[0]._id,
        reviewed_at: new Date()
      });
    }

    if (courses.length > 1 && instructors.length > 1) {
      approvalData.push({
        approval_id: "APP002",
        course_id: courses[1]._id,
        instructor_id: instructors[1]._id,
        status: "pending"
      });
    }

    if (approvalData.length > 0) {
      await CourseApprovalQueue.insertMany(approvalData);
    }

    console.log("Course approval queue created");


    console.log("ADMIN DATABASE SEEDED SUCCESSFULLY");

    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdminData();