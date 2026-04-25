const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema({

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    email: String,

    token: String,

    expires_at: Date,

    is_verified: { type: Boolean, default: false }

});

/* INDEX */
emailVerificationSchema.index({ token: 1 });
emailVerificationSchema.index({ email: 1 });

/* PROCEDURE */
emailVerificationSchema.statics.verifyToken = async function (token) {

    const record = await this.findOne({ token });

    if (!record) throw new Error("Invalid token");

    if (record.expires_at < new Date())
        throw new Error("Token expired");

    record.is_verified = true;
    await record.save();

    return record;
};

module.exports = mongoose.model("EmailVerification", emailVerificationSchema);