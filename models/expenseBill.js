/* ห้องเรียน เช่น ประถม 1/1 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChecklistSchema = new Schema({  
       _id: mongoose.Schema.Types.ObjectId,    
      projectid: { type: mongoose.Schema.Types.ObjectId, ref: 'Projects', required: true }, 
      roomid: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassRooms', required: true },
      billid: { type: mongoose.Schema.Types.ObjectId, ref: 'billlist', required: true }, 
      ownerid: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
      water_meter: {type: Number},
      water_unit: {type: Number}    ,
      water_price : {type: Number},
      common_fee : {type: Number},
      oth_expense : {type: Number,default: 0},
      oth_details:  {type: String},
      bill_type: {type: String,default: "montly"},
      status_pay:{ type: Boolean, default: false},
      status_approve:{ type: Boolean, default: false},
      roomname: {type: String,default: ""},
  },
  {
    timestamps: true
  }    
);

module.exports  = mongoose.model("expensbill", ChecklistSchema);