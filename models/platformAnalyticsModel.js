// models/platformAnalyticsModel.js
// Covers: Admin.tsx analytics tab (platform-wide stats, date range filter,
//         per-course enrollment lookup, user growth, revenue)
const mongoose = require('mongoose')

// Daily platform-wide snapshot
const platformDailySchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true },

    // User metrics
    new_registrations: { type: Number, default: 0, min: 0 },
    active_users: { type: Number, default: 0, min: 0 },
    total_users_cumulative: { type: Number, default: 0, min: 0 },

    // Course metrics
    new_enrollments: { type: Number, default: 0, min: 0 },
    courses_submitted: { type: Number, default: 0, min: 0 },
    courses_approved: { type: Number, default: 0, min: 0 },
    courses_completed: { type: Number, default: 0, min: 0 },

    // Revenue
    gross_revenue: { type: Number, default: 0, min: 0 },
    net_revenue: { type: Number, default: 0, min: 0 },
    refunds: { type: Number, default: 0, min: 0 },
    platform_revenue: { type: Number, default: 0, min: 0 },

    // Community
    new_posts: { type: Number, default: 0, min: 0 },
    new_questions: { type: Number, default: 0, min: 0 }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

platformDailySchema.index({ date: -1 })
platformDailySchema.index({ year: 1, month: 1 })

// Aggregate stats document (single doc, upserted frequently)
const platformStatsSchema = new mongoose.Schema({
    key: { type: String, default: 'global', unique: true },

    // Totals (Admin.tsx stats cards)
    total_users: { type: Number, default: 0 },
    total_students: { type: Number, default: 0 },
    total_instructors: { type: Number, default: 0 },
    total_admins: { type: Number, default: 0 },
    suspended_users: { type: Number, default: 0 },

    total_courses: { type: Number, default: 0 },
    published_courses: { type: Number, default: 0 },
    pending_courses: { type: Number, default: 0 },
    draft_courses: { type: Number, default: 0 },

    total_enrollments: { type: Number, default: 0 },
    total_completions: { type: Number, default: 0 },
    total_certificates: { type: Number, default: 0 },

    total_revenue: { type: Number, default: 0 },
    platform_revenue: { type: Number, default: 0 },
    instructor_payouts: { type: Number, default: 0 },

    avg_course_rating: { type: Number, default: 0 },
    total_reviews: { type: Number, default: 0 },

    last_computed_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

platformStatsSchema.index({ key: 1 }, { unique: true })

// Per-course enrollment snapshot for Admin analytics drill-down
const courseEnrollmentSnapshotSchema = new mongoose.Schema({
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    date: { type: Date, required: true },
    enrollment_count: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    completion_rate: { type: Number, default: 0, min: 0, max: 100 }
}, {
    timestamps: false
})

courseEnrollmentSnapshotSchema.index({ course_id: 1, date: -1 }, { unique: true })
courseEnrollmentSnapshotSchema.index({ date: -1 })

const PlatformDailyStats = mongoose.model('PlatformDailyStats', platformDailySchema)
const PlatformStats = mongoose.model('PlatformStats', platformStatsSchema)
const CourseEnrollmentSnapshot = mongoose.model('CourseEnrollmentSnapshot', courseEnrollmentSnapshotSchema)

module.exports = { PlatformDailyStats, PlatformStats, CourseEnrollmentSnapshot }