const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    items: [
        {
            course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
            price: Number
        }
    ]

});

/* INDEX */
cartSchema.index({ user_id: 1 });

module.exports = mongoose.model("Cart", cartSchema);