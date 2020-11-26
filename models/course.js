/* หลักสูตร การเรียน เช่น วิชาภาษไทย ป.1/1 (ปี 2563) */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CourseSchema = new Schema({
      subjectid: { type: mongoose.Schema.Types.ObjectId, ref: 'Subjects', required: true },
      classroomid: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassRooms', required: true },    
      coursename: {type: String },         
      detail: {type: String},
      member_in_class:{type: Boolean, default: false},
      teacher_in_class:{type: Boolean, default: false},
      status_active: {type: Boolean, default: false},
      status :{ type: Boolean, default: true}

  },
  {
    timestamps: true
  }    
);

module.exports  = mongoose.model("Course", CourseSchema);