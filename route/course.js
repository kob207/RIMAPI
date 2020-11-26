const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const ModelDatas = require("../models/course");
const ModelTecher= require("../models/teacherRef");
const ModelMember= require("../models/memberRef");
const ModelCourse= require("../models/courseRef");
const MongoClient = require("../models/mongoUtil");

const url = "http://localhost:5050";

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


router.get("/joinmember/:joinmember", (req, res, next) => { 
  var ObjectId = require('mongodb').ObjectID;  
  ModelMember.aggregate([
      { $match : { 'classroomid' :  ObjectId(  req.query.classroomid)  } }   ,    
         { $lookup:  {
            from: 'users',
            localField: 'memberid',
            foreignField: '_id', 
             as: 'members'
       },                  
      },         
    ]) .exec().then(function(data){       
     res.status(200).json(data );
     }).catch(function(err){
     console.log(err)
     });

});
 
router.post("/joinmember" , (req, res, next) => {  
   var io = req.app.get('socketio');
   let message ={"group_name":"a",
   "remain":"ทดสอบ",  
   } 
   const modeldata = new ModelMember({
     _id: new mongoose.Types.ObjectId(), 
     classroomid: req.body.classroomid,
     memberid: req.body.memberid,    
     detail: req.body.detail,           
     status_active:req.body.status_active,  
    
   });
   modeldata
     .save()
     .then(result => {       
       res.status(201).json({        
         message: "Created subject join class room successfully",
         modeldata: {         
          classroomid: result.classroomid,
          memberid: result.memberid,            
             detail:result.detail,
             status_active:result.status_active,              
             _id: result._id,
             request: {
                 type: 'GET',
                 url:url + "/subjectclass/" + result._id
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
 

 router.get("/joincourse/:joincourse", (req, res, next) => { 
  var ObjectId = require('mongodb').ObjectID;  
  ModelCourse.aggregate([
      { $match : { 'classroomid' :  ObjectId(  req.query.classroomid),
      'subjectid' :  ObjectId(  req.query.subjectid)  }
      
    }   ,    
         { $lookup:  {
            from: 'users',
            localField: 'memberid',
            foreignField: '_id', 
             as: 'members'
       },                  
      },         
    ]) .exec().then(function(data){       
     res.status(200).json(data );
     }).catch(function(err){
     console.log(err)
     });

});
 
router.post("/joincourse" , (req, res, next) => {  
   var io = req.app.get('socketio');
   let message ={"group_name":"a",
   "remain":"ทดสอบ",  
   } 
   const modeldata = new ModelCourse({
     _id: new mongoose.Types.ObjectId(), 
     classroomid: req.body.classroomid,
     subjectid: req.body.subjectid,
     memberid: req.body.memberid,    
     detail: req.body.detail,           
     status_active:req.body.status_active,  
    
   });
   modeldata
     .save()
     .then(result => {       
       res.status(201).json({        
         message: "Created subject join class room successfully",
         modeldata: {         
          classroomid: result.classroomid,
          subjectid: result.subjectid,
          memberid: result.memberid,            
             detail:result.detail,
             status_active:result.status_active,              
             _id: result._id,
             request: {
                 type: 'GET',
                 url:url + "/subjectclass/" + result._id
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

router.get("/jointeachers/:jointeachers", (req, res, next) => { 
  var ObjectId = require('mongodb').ObjectID;  
  ModelTecher.aggregate([
      { $match : { 'classroomid' :  ObjectId(  req.query.classroomid)  },
       
    }   ,    
         { $lookup:  {
            from: 'users',
            localField: 'teacherid',
            foreignField: '_id', 
             as: 'teachers'
       },                  
      }, 

     /*  {
        "$limit": 50
      } */
    
    ]) .exec().then(function(data){       
     res.status(200).json(data );
     }).catch(function(err){
     console.log(err)
     });

});
 
router.post("/jointeacher" , (req, res, next) => {  
  console.log("teacher")
   var io = req.app.get('socketio');
   let message ={"group_name":"a",
   "remain":"ทดสอบ",  
   } 
   const modeldata = new ModelTecher({
     _id: new mongoose.Types.ObjectId(), 
     classroomid: req.body.classroomid,
     teacherid: req.body.teacherid, 
    
     detail: req.body.detail,           
     status_active:req.body.status_active,  
    
   });
   modeldata
     .save()
     .then(result => {       
       res.status(201).json({        
         message: "Created subject join class room successfully",
         modeldata: {         
          classroomid: result.classroomid,
          teacherid: result.teacherid,            
             detail:result.detail,
             status_active:result.status_active,              
             _id: result._id,
             request: {
                 type: 'GET',
                 url:url + "/subjectclass/" + result._id
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
 

router.get("/joinsubjectid/:joinsubjectid", (req, res, next) => { 
       var ObjectId = require('mongodb').ObjectID;  
       ModelDatas.aggregate([
           { $match : { 'classroomid' :  ObjectId(  req.query.classroomid)  }
           }   ,    
              { $lookup:  {
                 from: 'subjects',
                 localField: 'subjectid',
                 foreignField: '_id', 
                  as: 'course'
            },                  
           },         
         ]) .exec().then(function(data){       
          res.status(200).json(data );
          }).catch(function(err){
          console.log(err)
          });
  
});

router.post("/joinsubject" , (req, res, next) => {
    console.log(" joinsubject classroomid " +  req.body.classroomid );
    console.log(" joinsubject subjectid" +  req.body.subjectid );
     var io = req.app.get('socketio');
     let message ={"group_name":"a",
     "remain":"ทดสอบ",  
     } 
     const modeldata = new ModelDatas({
       _id: new mongoose.Types.ObjectId(), 
       classroomid: req.body.classroomid,
       subjectid: req.body.subjectid,
       coursename: req.body.coursename,
       detail: req.body.detail,           
       status_active:req.body.status_active,  
      
      
     });
     modeldata
       .save()
       .then(result => {       
         res.status(201).json({        
           message: "Created subject join class room successfully",
           modeldata: {         
            classroomid: result.classroomid,
               subjectid: result.subjectid,
               coursename:result.coursename,
               detail:result.detail,
               status_active:result.status_active,              
               _id: result._id,
               request: {
                   type: 'GET',
                   url:url + "/subjectclass/" + result._id
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
  ModelDatas.remove({ _id: id })
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
