const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    course_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]

});

/* INDEX */
wishlistSchema.index({ user_id: 1 });

/* PROCEDURE */
wishlistSchema.statics.addToWishlist = async function (userId, courseId) {
    return this.findOneAndUpdate(
        { user_id: userId },
        { $addToSet: { course_ids: courseId } },
        { upsert: true, new: true }
    );
};

module.exports = mongoose.model("Wishlist", wishlistSchema);