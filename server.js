require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

/* ROUTES */
const userRoutes = require("./controllers/userController");

/* DATABASE VIEWS */
const createViews = require("./database/databaseViews");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

app.use(cors());
app.use(express.json());

/* ---------------- DATABASE CONNECTION ---------------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected Successfully");

    try {
      await createViews();
      console.log("Database Views Initialized");
    } catch (error) {
      console.log("View initialization error:", error.message);
    }
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed:", error);
  });

/* ---------------- ROUTES ---------------- */

app.use("/api/users", userRoutes);

/* TEST ROUTE */

app.get("/", (req, res) => {
  res.send("API is running successfully");
});

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});