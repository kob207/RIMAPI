const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,    
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    name: { type: String, default: "Untital" },   
    detail: { type: String, default: "No Detail" },
    projecttype: { type: String, default: "" },
    image_url:{ type: String, default:"default.png" },
});
module.exports = mongoose.model('Projects', orderSchema);




