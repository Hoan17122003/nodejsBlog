const mongoose = require('mongoose');
// const mongooseSlug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const User = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        passWord: { type: String },
        name: { type: String, },
        age: { type: Date },
        gender: { type: String },
        email: { type: String, unique: true, require: true, },
        chuyenNganh: { type: String, },
        authType: {
            type: String,
            enum: ['local', 'google', 'facebook']// type enum : chỉ cho phép giá trị có sẳn trong array mà thôi
            ,
            default: 'local'
        },
        authGoogleID: {
            type: String,
            default: null,
        },
        authFaceBookID: {
            type: String,
            default: null,
        },
        level: { type: String, maxLength: 10, default: 'newbie' },
        role: { type: String, required: false },
        address: { type: String },
        avatar: { type: String },
        pages: [{ type: Schema.Types.ObjectId, ref: 'Pages' }],
        refreshToken: { type: String, default: 'undefined' }
    }, {
    timestamps: true
});

User.pre('save', async function (req, res, next) {
    try {
        if (this.authType == 'local') {
            const salt = await bcrypt.genSalt(10);
            const passwordHashed = await bcrypt.hash(this.passWord, salt);
            this.passWord = passwordHashed;
            next();
        }
        next();
    } catch (error) {
        next(error);
    }
    // try {
    //     if (!this.isModified('password')) {
    //         return next();
    //     }
    //     const salt = await bcrypt.genSalt(10);
    //     this.password = await bcrypt.hash(this.password, salt);
    //     next();
    // } catch (error) {
    //     next();

    // }
})


User.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.passWord);
    } catch (error) {
        throw new Error(error);
    }
}

User.plugin(mongooseDelete, {
    overrideMethods: 'all'
})




module.exports = mongoose.model('Users', User);