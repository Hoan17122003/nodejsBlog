// const { timeStamp } = require('console');
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const user = require('./user');
const Schema = mongoose.Schema

const Page = new Schema({
    title: {
        type: String,
        required: true,
    },
    heading: {
        type: String,
        require: true,
        maxLength: 256,
    },
    content: { type: String, required: true },
    image: { type: String, }
    ,
    slug: {
        type: String, slug: 'title',
    },
},
    {
        timestamp: true

    }
);

// page.pre('save', async function(){

// });

// Add plugins
mongoose.plugin(slug);
Page.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Pages', Page);