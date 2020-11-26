

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const ParentRef = require("../models/parentRef");
const MongoClient = require("../models/mongoUtil");
const url = "http://localhost:5050";

//const dburl="mongodb://localhost:27017/mmm";
//const  MongoClient = require('mongodb').MongoClient;   

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads/');
   // cb(null, path.join(__dirname, '../uploads/'))
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


 

  /*  { $lookup:  {
                     from: 'users',
                     localField: 'userid',
                     foreignField: '_id',                                   
                      as: 'children'
                },                  
               }, */

 router.get("/:joinparentid", (req, res, next) => {      
     /*   MongoClient.connectToServer( function( err, client ) { */
     /*     if (err) console.log(err);
         var db = MongoClient.getDb();
         console.log("req ",req.query.parentid) */
          var ObjectId = require('mongodb').ObjectID;  
          ParentRef.aggregate([
             { $match : { 'parentid' :    ObjectId( req.query.parentid) } }   ,  
                { $lookup:  {
                    from: 'users',
                    localField: 'userid',
                    foreignField: '_id',                                   
                     as: 'children'
               },                  
              },       
            ])   .exec().then(function(data){       
              res.status(200).json(data);
              }).catch(function(err){
              console.log(err)
              });
  });
           
 
  


router.get("/:parentid", (req, res, next) => {

    ParentRef.find( {subjectid: req.query.subjectid})
  .select("_id userid parentid projectid noti status active ")
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      ParentRef: docs.map(doc => {        
        return {
          _id: doc._id,
          userid:doc.userid,
          parentid:doc.parentid,
          projectid:doc.projectid,
          noti:doc.noti,
          status:doc.status,
          active:doc.active,
          
           request: {
            type: "GET",
            url: url + "/parentref/" + doc._id
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


 





router.post("/new", (req, res, next) => {
 console.log("add  subject img");
  var io = req.app.get('socketio');
  let message ={"group_name":"a",
  "remain":"ทดสอบ",  
  } 
  const parentref = new ParentRef({
    _id: new mongoose.Types.ObjectId(), 
    userid: req.body.userid,
    parentid: req.body.parentid,
    projectid: req.body.projectid,
    noti: 0,  
    status:true,
    active:true,  
    
  });
  parentref
    .save()
    .then(result => {       
      res.status(201).json({        
        message: "Created user successfully",
        createdUser: {         
            userid: result.userid,
            parentid: result.parentid,
            projectid:result.projectid,
            noti:result.noti,            
            status:result.status,
            active:result.active,
            _id: result._id,
            request: {
                type: 'GET',
                url:url + "/parent/" + result._id
            }
        }
      });
      io.emit( req.body.realtime_key    ,message);   
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

   

router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;
  Project.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'User deleted',
          request: {
              type: 'POST',
              url: url + '/user',
              body: { name: 'String', price: 'Number' }
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
