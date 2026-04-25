const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

    amount: Number,

    payment_method: String,

    status: {
        type: String,
        enum: ["pending", "completed", "failed"]
    },

    created_at: { type: Date, default: Date.now }

});

/* INDEX */
paymentSchema.index({ user_id: 1 });
paymentSchema.index({ status: 1 });

/* VIEW */
paymentSchema.statics.getUserOrders = function (userId) {
    return this.find({ user_id: userId }).populate("course_id");
};

module.exports = mongoose.model("Payment", paymentSchema);