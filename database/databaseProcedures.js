const Enrollment = require("../models/enrollmentModel");
const Payment = require("../models/paymentModel");
const Certificate = require("../models/certificateModel");
const Notification = require("../models/notificationModel");
const Streak = require("../models/streakModel");


/* =====================================================
1. ENROLL USER + PAYMENT + NOTIFICATION
===================================================== */
exports.enrollUser = async (userId, courseId, amount) => {

    // Check already enrolled
    const exists = await Enrollment.findOne({ user_id: userId, course_id: courseId });
    if (exists) throw new Error("Already enrolled");

    // Payment
    await Payment.create({
        user_id: userId,
        course_id: courseId,
        amount,
        status: "completed"
    });

    // Enrollment
    const enrollment = await Enrollment.create({
        user_id: userId,
        course_id: courseId
    });

    // Notification
    await Notification.create({
        user_id: userId,
        title: "Enrollment Successful",
        message: "You have enrolled in a course",
        type: "enrollment"
    });

    return enrollment;
};


/* =====================================================
2. COMPLETE COURSE + CERTIFICATE
===================================================== */
exports.completeCourse = async (userId, courseId) => {

    const enrollment = await Enrollment.findOneAndUpdate(
        { user_id: userId, course_id: courseId },
        { progress: 100, completed: true },
        { new: true }
    );

    if (!enrollment) throw new Error("Enrollment not found");

    const certificate = await Certificate.create({
        user_id: userId,
        course_id: courseId,
        certificate_hash: Math.random().toString(36).substring(2, 12)
    });

    return certificate;
};


/* =====================================================
3. UPDATE USER STREAK
===================================================== */
exports.updateUserStreak = async (userId) => {

    const today = new Date();

    let record = await Streak.findOne({ user_id: userId });

    if (!record) {
        return Streak.create({
            user_id: userId,
            current_streak: 1,
            last_active_date: today
        });
    }

    const diff = Math.floor((today - record.last_active_date) / (1000 * 60 * 60 * 24));

    if (diff === 1) record.current_streak += 1;
    else if (diff > 1) record.current_streak = 1;

    record.last_active_date = today;

    return record.save();
};


/* =====================================================
4. MARK NOTIFICATIONS AS READ
===================================================== */
exports.markNotificationsRead = async (userId) => {

    return Notification.updateMany(
        { user_id: userId },
        { is_read: true }
    );
};


/* =====================================================
5. APPLY COUPON (ADVANCED LOGIC)
===================================================== */
exports.applyCoupon = async (coupon, amount) => {

    if (!coupon.is_active) throw new Error("Coupon inactive");

    if (coupon.expires_at < new Date())
        throw new Error("Coupon expired");

    if (coupon.discount_type === "percentage") {
        return amount - (amount * coupon.discount_value / 100);
    }

    if (coupon.discount_type === "fixed") {
        return amount - coupon.discount_value;
    }

    return amount;
};


/* =====================================================
6. GENERATE CERTIFICATE HASH (SECURE)
===================================================== */
exports.generateCertificateHash = () => {
    return require("crypto")
        .randomBytes(16)
        .toString("hex");
};