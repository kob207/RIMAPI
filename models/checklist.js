/* ห้องเรียน เช่น ประถม 1/1 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChecklistSchema = new Schema({     
      classroomid: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassRooms', required: true },      
      detail: {type: String},
      memberlist:{ type: Array,default: []},     
      notify: { type: Boolean, default: false},
      actived :{ type: Boolean, default: true}
  },
  {
    timestamps: true
  }    
);

module.exports  = mongoose.model("checklistclass", ChecklistSchema);