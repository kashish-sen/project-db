const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    plan: {
        type: String,
        enum: ["free", "pro", "team"]
    },

    start_date: Date,
    end_date: Date,

    is_active: Boolean

});

/* INDEX */
subscriptionSchema.index({ user_id: 1 });

module.exports = mongoose.model("Subscription", subscriptionSchema);