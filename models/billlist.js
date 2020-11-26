/* ห้องเรียน เช่น ประถม 1/1 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChecklistSchema = new Schema({     
      projectid: { type: mongoose.Schema.Types.ObjectId, ref: 'Projects', required: true }, 
      detail: {type: String},
      roomlist:{ type: Array,default: []},     
      notify: { type: Boolean, default: false},      
      actived :{ type: Boolean, default: true}
  },
  {
    timestamps: true
  }    
);

module.exports  = mongoose.model("billlist", ChecklistSchema);