const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    title: String,
    message: String,

    type: {
        type: String,
        enum: ["info", "success", "warning", "error", "discussion", "enrollment", "price_drop"]
    },

    link: String,

    is_read: { type: Boolean, default: false },

    created_at: { type: Date, default: Date.now }

});

/* INDEXES */
notificationSchema.index({ user_id: 1, is_read: 1 });
notificationSchema.index({ created_at: -1 });

/* PROCEDURE */
notificationSchema.statics.markAllAsRead = function (userId) {
    return this.updateMany({ user_id: userId }, { is_read: true });
};

module.exports = mongoose.model("Notification", notificationSchema);