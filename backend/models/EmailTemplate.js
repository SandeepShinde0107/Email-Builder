const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
    title: String,
    content: String,
    footer: String,
    imageUrl: String,
});

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);
