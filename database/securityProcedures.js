const SecurityLog = require("../models/securityLogModel");

/* =====================================================
1. RATE LIMIT CHECK
===================================================== */
exports.enforceRateLimit = async (ip) => {

    const allowed = await SecurityLog.checkRateLimit(ip);

    if (!allowed) {
        await SecurityLog.create({
            ip_address: ip,
            is_suspicious: true,
            reason: "Rate limit exceeded"
        });

        throw new Error("Too many requests");
    }

};


/* =====================================================
2. LOG EVERY REQUEST
===================================================== */
exports.logRequest = async (req, statusCode) => {

    return SecurityLog.create({
        ip_address: req.ip,
        user_id: req.user?._id || null,
        endpoint: req.originalUrl,
        method: req.method,
        status_code: statusCode
    });

};


/* =====================================================
3. DETECT SUSPICIOUS LOGIN
===================================================== */
exports.detectSuspiciousActivity = async (ip) => {

    const last10min = new Date(Date.now() - 10 * 60 * 1000);

    const failedAttempts = await SecurityLog.countDocuments({
        ip_address: ip,
        status_code: 401,
        created_at: { $gte: last10min }
    });

    if (failedAttempts > 10) {
        await SecurityLog.create({
            ip_address: ip,
            is_suspicious: true,
            reason: "Multiple failed login attempts"
        });

        return true;
    }

    return false;
};