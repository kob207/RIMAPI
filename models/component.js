const mongoose = require('mongoose');

const componentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    descryption: { type: String, required: true },
    componentImage: { type: String, required: true },
    status: { type: String, required: true }
});

module.exports = mongoose.model('Component', componentSchema);