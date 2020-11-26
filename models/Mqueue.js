const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const m_queueSchema = new Schema(
  {
  
    message: {
      type: String
    },
   
    group_name: {
      type: String
    },
    remain: {
      type: Number
    },
    current: {
      type: Number
    },
    last: {
      type: Number
    },   
    detail: {
      type: String
    },
  },
  {
    timestamps: true
  } 
   
);


 


let Csp_queue = mongoose.model("m-queue", m_queueSchema);

module.exports = Csp_queue;
