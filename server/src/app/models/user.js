const mongoose = require('mongoose');
// const mongooseSlug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const User = new Schema({
    userName: { type: String, require: false },
    password: { type: String, require: false },
    name: { type: String, require: false },
    age: { type: Date },
    gender: { type: String },
    role: { type: String, require: false },
    address: { type: String }
}, {
    timestamps: true
})

User.plugin(mongooseDelete, {
    overrideMethods: 'all'
})




module.exports = mongoose.model('User', User);