const mongoose = require("mongoose");

const streakSchema = new mongoose.Schema({

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    current_streak: { type: Number, default: 0 },

    last_active_date: Date

});

/* INDEX */
streakSchema.index({ user_id: 1 });

/* PROCEDURE */
streakSchema.statics.updateStreak = async function (userId) {

    const today = new Date();

    let record = await this.findOne({ user_id: userId });

    if (!record) {
        return this.create({ user_id: userId, current_streak: 1, last_active_date: today });
    }

    const diff = Math.floor((today - record.last_active_date) / (1000 * 60 * 60 * 24));

    if (diff === 1) record.current_streak += 1;
    else if (diff > 1) record.current_streak = 1;

    record.last_active_date = today;

    return record.save();
};

module.exports = mongoose.model("Streak", streakSchema);