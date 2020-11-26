const mongoose = require('mongoose');

const subjectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,    
    ownerid: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    levelid: { type: mongoose.Schema.Types.ObjectId, ref: 'Levels', required: true },
    name: { type: String, default: "Untital" },   
    detail: { type: String, default: "No Detail" },
    subjecttype: { type: String, default: "" },
    credit:{ type: Number, default: 0 },
    image_url:{ type: String, default:"default.png" },   
});
module.exports = mongoose.model('Subjects', subjectSchema);


