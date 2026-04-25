const mongoose = require('mongoose')

const userDashboardSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    // Learning streak (InstructorProfile achievements: 7-day-streak)
    current_streak: { type: Number, default: 0, min: 0 },
    longest_streak: { type: Number, default: 0, min: 0 },
    last_study_date: { type: Date },
    total_study_days: { type: Number, default: 0, min: 0 },
    total_watch_time_seconds: { type: Number, default: 0, min: 0 },

    // Summary counters (denormalised for fast dashboard load)
    enrolled_courses_count: { type: Number, default: 0, min: 0 },
    completed_courses_count: { type: Number, default: 0, min: 0 },
    certificates_earned: { type: Number, default: 0, min: 0 },
    total_quiz_attempts: { type: Number, default: 0, min: 0 },
    avg_quiz_score: { type: Number, default: 0, min: 0, max: 100 },

    // Learning goal (Dashboard progress bar)
    weekly_goal_minutes: { type: Number, default: 60 },
    weekly_minutes_this_week: { type: Number, default: 0 },

    // Recently viewed (for quick resume)
    recently_viewed: [{
        course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        lesson_id: { type: mongoose.Schema.Types.ObjectId },
        viewed_at: { type: Date, default: Date.now }
    }]
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

userDashboardSchema.index({ user_id: 1 }, { unique: true })
userDashboardSchema.index({ current_streak: -1 })

const UserDashboard = mongoose.model('UserDashboard', userDashboardSchema)

module.exports = UserDashboard