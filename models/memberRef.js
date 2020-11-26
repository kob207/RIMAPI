/* หลักสูตร การเรียน เช่น วิชาภาษไทย ป.1/1 (ปี 2563) */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RefSchema = new Schema({
      memberid: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
      classroomid: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassRooms', required: true },      
      detail: {type: String},
      status_active: {type: Boolean, default: false},
      status :{ type: Boolean, default: true}
  },
  {
    timestamps: true
  }    
);
module.exports  = mongoose.model("MemberRef", RefSchema);