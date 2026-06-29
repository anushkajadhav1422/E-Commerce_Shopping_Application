const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

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

UserSchema.methods.getResetPasswordToken = async function () {
    // Generating Token
    const resetToken = (Math.random() + 1).toString(36).substring(2); // Simple random token

    // Hashing and adding resetPasswordToken to userSchema using bcrypt
    let hashedToken = await bcrypt.hash(resetToken, 10); // Adjust salt rounds as needed

    // Remove any '/' from the hashed token
    hashedToken = hashedToken.replace(/\//g, '');

    this.resetPasswordToken = hashedToken;

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // Token valid for 15 minutes

    return hashedToken; // Return the hashed token without '/'
};

module.exports = mongoose.model('user', UserSchema)