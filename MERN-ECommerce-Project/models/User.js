const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;
const crypto = require("crypto");

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        default: false,
        type: Boolean
    },
    Isverified: {
        type: Number,
        default: 0,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    },
    role: {
        type: String,
        enum: ["user", "admin", "manager"],
        default: "user"
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
    address: {
        type: String
    },
    zipCode: {
        type: String
    },
    city: {
        type: String
    },
    userState: {
        type: String
    }

}, { timestamps: true });

// UserSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         next();
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });

UserSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.password) {
        const salt = await bcrypt.genSalt(10);
        update.password = await bcrypt.hash(update.password, salt);
    }
    next();
    console.log();

});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {

    // Generate random token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Store hashed token in DB
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Expiry
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    // Return plain token
    return resetToken;
};

module.exports = mongoose.model('user', UserSchema)