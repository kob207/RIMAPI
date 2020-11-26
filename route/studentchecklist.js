const express = require("express");
const router = express.Router(); 
const Checklists = require("../models/checklist");
 

 

 
router.get("/", (req, res, next) => {  
    console.log("get student list")
   const id = req.query.checkid;
   Checklists.find({
    _id: id
  }).select("_id classroomid  actived memberlist notify detail createdAt")
   .exec()
   .then(docs => {
     const response = {
       count: docs.length,
       checklist: docs.map(doc => {        
         return {
              _id: doc._id,               
              classroomid: doc.classroomid,
              detail:doc.detail,
             actived:doc.actived,
              notify: doc.notify,   
              memberlist:doc.memberlist,

       /*        classroomid: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassRooms', required: true },      
              detail: {type: String},
              memberlist:{ type: Array,default: []},     
              notify: { type: Boolean, default: false},
              actived :{ type: Boolean, default: true} */


            
              createdAt:doc.createdAt,  
            request: {
             type: "GET",
             url:   "/checklists/" + doc._id
           }
         };
       })
     };      
     res.status(200).json(response);       
   })
   .catch(err => {
     console.log(err);
     res.status(500).json({
       error: err
     });
   });
  });
 
 


 


 
 




 
 
module.exports = router;
