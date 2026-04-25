const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({

    type: String, // revenue / users / courses

    value: Number,

    metadata: Object,

    created_at: { type: Date, default: Date.now }

});

analyticsSchema.index({ type: 1 });
analyticsSchema.index({ created_at: -1 });

module.exports = mongoose.model("Analytics", analyticsSchema);