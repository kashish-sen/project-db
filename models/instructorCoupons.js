const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({

    code: { type: String, unique: true },

    discount_type: {
        type: String,
        enum: ["percentage", "fixed"]
    },

    discount_value: Number,

    max_uses: Number,

    used_count: { type: Number, default: 0 },

    expires_at: Date,

    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

    is_active: { type: Boolean, default: true }

});

couponSchema.index({ code: 1 });
couponSchema.index({ course_id: 1 });

module.exports = mongoose.model("Coupon", couponSchema);