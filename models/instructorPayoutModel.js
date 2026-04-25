const mongoose = require('mongoose')

const payoutSchema = new mongoose.Schema({
    instructor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Period this payout covers
    period_start: { type: Date, required: true },
    period_end: { type: Date, required: true },

    // Amounts
    gross_earnings: { type: Number, required: true, min: 0 },
    platform_fee: { type: Number, required: true, min: 0 },
    refund_deductions: { type: Number, default: 0, min: 0 },
    tax_deducted: { type: Number, default: 0, min: 0 },  // TDS for Indian instructors
    net_payout: { type: Number, required: true, min: 0 },

    // Status
    status: {
        type: String,
        enum: ['pending', 'processing', 'paid', 'failed', 'on_hold'],
        default: 'pending'
    },
    paid_at: { type: Date },
    transaction_ref: { type: String, trim: true },   // bank transfer reference

    // Breakdown by course
    course_breakdown: [{
        course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        enrollments: Number,
        gross: Number,
        net: Number
    }],

    notes: { type: String, trim: true }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true }
})

payoutSchema.index({ instructor_id: 1, period_start: -1 })
payoutSchema.index({ status: 1, period_end: -1 })
payoutSchema.virtual('id').get(function () { return this._id.toHexString() })

const InstructorPayout = mongoose.model('InstructorPayout', payoutSchema)

module.exports = InstructorPayout