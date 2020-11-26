const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const queueSchema = new Schema(
  {
    message: {
      type: String
    },
    sender: {
      type: String
    },
    groupname: {
      type: String
    },
    status_read: {
      type: Boolean
    },
    queueno: {
      type: Number
    },
    counter_no: {
      type: Number
    },
    remain: {
      type: String
    }
  },
  {
    timestamps: true
  } 
   
);

let Csp_queue = mongoose.model("csp-queue", queueSchema);

module.exports = Csp_queue;
