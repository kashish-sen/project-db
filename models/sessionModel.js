const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    session_token: {
        type: String,
        required: true,
        unique: true
    },

    device: {
        type: String // e.g. "Chrome on Mac", "iPhone Safari"
    },

    ip_address: {
        type: String
    },

    user_agent: {
        type: String
    },

    is_active: {
        type: Boolean,
        default: true
    },

    expires_at: {
        type: Date,
        required: true
    },

    created_at: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

/* =====================================================
INDEXES (HIGH PERFORMANCE)
===================================================== */

// Fast lookup for auth middleware
sessionSchema.index({ session_token: 1 });

// Fetch user sessions
sessionSchema.index({ user_id: 1 });

// Expiration cleanup (TTL INDEX)
sessionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

/* =====================================================
PROCEDURES (MODEL METHODS)
===================================================== */

// Create session
sessionSchema.statics.createSession = async function (userId, token, device, ip, userAgent) {
    return this.create({
        user_id: userId,
        session_token: token,
        device,
        ip_address: ip,
        user_agent: userAgent,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
};

// Invalidate session
sessionSchema.statics.invalidateSession = function (token) {
    return this.findOneAndUpdate(
        { session_token: token },
        { is_active: false }
    );
};

// Get active sessions
sessionSchema.statics.getActiveSessions = function (userId) {
    return this.find({ user_id: userId, is_active: true });
};

module.exports = mongoose.model("Session", sessionSchema);