const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    action: {
        type: String,
        required: true
    },

    resource: {
        type: String // e.g. "COURSE", "USER", "PAYMENT"
    },

    resource_id: {
        type: mongoose.Schema.Types.ObjectId
    },

    metadata: {
        type: Object // extra details
    },

    ip_address: String,

    user_agent: String,

    created_at: {
        type: Date,
        default: Date.now
    }

});

/* =====================================================
INDEXES
===================================================== */

// Filter by user activity
auditLogSchema.index({ user_id: 1 });

// Admin filtering
auditLogSchema.index({ action: 1 });

// Timeline queries
auditLogSchema.index({ created_at: -1 });

// Compound index for admin dashboards
auditLogSchema.index({ user_id: 1, action: 1 });

/* =====================================================
PROCEDURES
===================================================== */

// Log any action
auditLogSchema.statics.logAction = function ({
    userId,
    action,
    resource,
    resourceId,
    metadata,
    ip,
    userAgent
}) {
    return this.create({
        user_id: userId,
        action,
        resource,
        resource_id: resourceId,
        metadata,
        ip_address: ip,
        user_agent: userAgent
    });
};

module.exports = mongoose.model("AuditLog", auditLogSchema);