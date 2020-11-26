const mongoose = require('mongoose');

const parentrefSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,    
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    parentid: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    projectid: { type: mongoose.Schema.Types.ObjectId, ref: 'Projects', required: true },     
    noti: { type: Number, default: 0 },
    status: { type: Boolean, default:true},
    active:{ type: Boolean,default: false },
},
{
    timestamps: true
  } 
);
module.exports = mongoose.model('ParentRef', parentrefSchema);
