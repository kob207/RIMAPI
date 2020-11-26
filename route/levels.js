const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
 
const Levels = require("../models/levels");
const url = "http://localhost:5050";
 
 
 

router.get("/", (req, res, next) => {   
    Levels.find(    )
    .select("_id projectid name detail createdate status")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Levels: docs.map(doc => {        
          return {
            _id: doc._id,
            projectid:doc.projectid,
            name:doc.name,
            detail:doc.detail,
            createdate:doc.createdate,
            status:doc.status,           
             request: {
              type: "GET",
              url: url + "/Levels/" + doc._id
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


router.get("/:projectid", (req, res, next) => {   
  Levels.find( {projectid: req.query.projectid}  )
  .select("_id projectid name detail createdate status")
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      Levels: docs.map(doc => {        
        return {
          _id: doc._id,
          projectid:doc.projectid,
          name:doc.name,
          detail:doc.detail,
          createdate:doc.createdate,
          status:doc.status,           
           request: {
            type: "GET",
            url: url + "/Levels/" + doc._id
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

 
router.post("/new" , (req, res, next) => {    
     var io = req.app.get('socketio');
     let message ={"group_name":"a",
     "remain":"ทดสอบ",  
     } 
     const level = new Levels({
       _id: new mongoose.Types.ObjectId(), 
       projectid: req.body.projectid,
       name: req.body.name,
       detail: req.body.detail,
       createdate:new Date().toJSON() ,
       status: true });
        level
       .save()
       .then(result => {       
         res.status(201).json({        
           message: "Created Level successfully",
           level: {  
               _id: result._id,       
               projectid: result.projectid,
               name: result.name,
               detail:result.detail,
               createdate:result.createdate ,
               status:result.status ,            
               request: {
                   type: 'GET',
                   url:url + "/level/" + result._id
               }
           }
         });
      io.emit( req.body.realtime_key    ,message);   
      io.emit( 'notiio'    ,message);   
         console.log("send noti ")
       })
       .catch(err => {
         console.log(err);
         res.status(500).json({
           error: err
         });
       });
   });

 

module.exports = router;
