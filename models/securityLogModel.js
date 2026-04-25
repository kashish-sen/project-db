const mongoose = require("mongoose");

const securityLogSchema = new mongoose.Schema({

    ip_address: {
        type: String,
        required: true
    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    endpoint: String, // e.g. "/login"

    method: String, // GET / POST

    status_code: Number,

    is_suspicious: {
        type: Boolean,
        default: false
    },

    reason: String, // e.g. "Too many requests"

    created_at: {
        type: Date,
        default: Date.now
    }

});

/* =====================================================
INDEXES
===================================================== */

// IP tracking (rate limiting)
securityLogSchema.index({ ip_address: 1 });

// Time-based queries
securityLogSchema.index({ created_at: -1 });

// Suspicious activity
securityLogSchema.index({ is_suspicious: 1 });

// Compound for rate limiting
securityLogSchema.index({ ip_address: 1, created_at: -1 });

/* =====================================================
PROCEDURES
===================================================== */

// Log request
securityLogSchema.statics.logRequest = function (data) {
    return this.create(data);
};

// Check rate limit (basic)
securityLogSchema.statics.checkRateLimit = async function (ip) {

    const lastMinute = new Date(Date.now() - 60 * 1000);

    const count = await this.countDocuments({
        ip_address: ip,
        created_at: { $gte: lastMinute }
    });

    return count < 100; // allow 100 requests/min
};

module.exports = mongoose.model("SecurityLog", securityLogSchema);