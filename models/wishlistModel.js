const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  wishlist_id: String,
  user_id: String,
  course_id: String,
  added_at: Date
});

module.exports = mongoose.model("Wishlist", wishlistSchema);