const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    detail: { type: String, required: true },
    boardImage: { type: String, required: true }
});

module.exports = mongoose.model('Board', productSchema);