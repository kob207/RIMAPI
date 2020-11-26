/* "name": "คณะบริหาร",
"icon": FontAwesomeIcons.user,
"items": 5 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categoriesSchema = new Schema({
      name: {type: String },   
      icon: {type: String },
      member: {type: Array},
      permission: {type: Array},       
      detail: {type: String},
  },
  {
    timestamps: true
  }    
);

module.exports  = mongoose.model("categories", categoriesSchema);
 
