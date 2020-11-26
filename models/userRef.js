const mongoose = require('mongoose');

const userrefSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,    
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    projectid: { type: mongoose.Schema.Types.ObjectId, ref: 'Projects', required: true },
    name: { type: String, default: "Untital" },   
    noti: { type: Number, default: 0 },
    status: { type: Boolean, default:true},
    active:{ type: Boolean,default: false },
});
module.exports = mongoose.model('UserRef', userrefSchema);




