const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/* ---------------- SUBMIT IDEA ---------------- */

router.post("/submit", async (req, res) => {
  try {
    const ideaData = req.body;

    const db = mongoose.connection.db;

    const result = await db.collection("ideas").insertOne(ideaData);

    res.status(201).json({
      message: "Idea submitted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error submitting idea:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------- GET IDEAS ---------------- */

router.get("/ideas", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const ideas = await db.collection("ideas").find().toArray();

    res.status(200).json(ideas);
  } catch (error) {
    console.error("Error fetching ideas:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------- EXPORT ROUTER ---------------- */

module.exports = router;