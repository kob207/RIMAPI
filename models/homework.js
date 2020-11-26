const mongoose = require('mongoose');

const homeworkSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    subjectid:{ type: mongoose.Schema.Types.ObjectId, ref: 'Component', required: true },
    ownerid: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    subject:{ type: String, required: true },
    descryption: { type: String, required: true },
    createdate: { type: String, required: true },
    duedate: { type: String   },
    image_url:{ type: String },
    status: { type: String, required: true }
});
// default:"default.png"
module.exports = mongoose.model('Homeworks', homeworkSchema);