
/* ชั้นเรียน เช่น อนุบาล1, ประุถม 1 มัธยม 1 หรือชั้นของอพาร์ทเม้น */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const levelsSchema = new Schema({
      projectid: { type: mongoose.Schema.Types.ObjectId, ref: 'Projects', required: true },
      name: {type: String },               
      detail: {type: String},
      createdate: {type: String},
      status: { type: String, required: true }
      },
  {
    timestamps: true
  }    
);

module.exports  = mongoose.model("Levels", levelsSchema);