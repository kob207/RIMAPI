/* ห้องเรียน เช่น ประถม 1/1 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ClassRoomsSchema = new Schema({
      projectid: { type: mongoose.Schema.Types.ObjectId, ref: 'Projects', required: true },
      levelid: { type: mongoose.Schema.Types.ObjectId, ref: 'Levels', required: true },
      name: {type: String },      
      detail: {type: String},
      image_url:{ type: String, default:"uploads\\default.jpg" },  
      noti:{ type: Number, default: 0 },
      status: { type: Boolean, default: true},
      statusclose :{ type: Boolean, default: true},
      price :{ type: Number, default: 0},
      rentstatus :{ type: Boolean, default: false},
      electric :{ type: Number, default: 0},
      water :{ type: Number, default: 0},
      recordwater:{ type: Boolean, default: false},
  },
  {
    timestamps: true
  }    
);

module.exports  = mongoose.model("ClassRooms", ClassRoomsSchema);