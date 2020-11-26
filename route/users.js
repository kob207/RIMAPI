const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const Users = require("../models/users");
const ModelProjectRef = require("../models/userRef");
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

router.get("/", (req, res, next) => {
    Users.find().limit(50)
    .select("name detail _id userImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Users: docs.map(doc => {        
          return {
            name: doc.name,
            addno: doc.addno,
            subscript: doc.subscript,
            follow: doc.follow,
            projects:doc.projects,
            status:doc.status,
            userImage: doc.userImage,            
            _id: doc._id,
            request: {
              type: "GET",
              url: url + "/users/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});



router.get("/phoneno", (req, res, next) => {
 

  var condi =   req.query.phoneno   
  var condition =condition={"phoneno":  {'$regex': condi} };      
    Users.find(condition).limit(50)
    .select("name phoneno _id userImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Users: docs.map(doc => {        
          return {
            name: doc.name,
            status:doc.status,
            phoneno:doc.phoneno,
            userImage: doc.userImage,            
            _id: doc._id,
            request: {
              type: "GET",
              url: url + "/users/" + doc._id
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


router.get("/name", (req, res, next) => {
  var condi =   req.query.name   
  var condition =condition={"name":  {'$regex': condi} };      
    Users.find(condition).limit(50)
    .select("name detail _id userImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Users: docs.map(doc => {        
          return {
            name: doc.name,
            addno: doc.addno,
            subscript: doc.subscript,
            follow: doc.follow,
            projects:doc.projects,
            status:doc.status,
            img: doc.userImage,            
            _id: doc._id,
            request: {
              type: "GET",
              url: url + "/users/" + doc._id
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

router.get("/namelist", (req, res, next) => {
  var condi =   req.query.id   
  var condition =condition={"_id":  {'$in': ['5ed77c76473daf3d88707379','5ed77c8a473daf3d8870737a']} };      
    Users.find(condition).limit(50)
    .select("name detail _id userImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Users: docs.map(doc => {        
          return {
            name: doc.name,
            addno: doc.addno,
            subscript: doc.subscript,
            follow: doc.follow,
            projects:doc.projects,
            status:doc.status,
            img: doc.userImage,            
            _id: doc._id,
            request: {
              type: "GET",
              url: url + "/users/" + doc._id
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


router.post("/new", upload.single('userImage'), (req, res, next) => {
 console.log("add user");
  var io = req.app.get('socketio');
  let message ={"group_name":"a",
  "remain":"ทดสอบ",  
  } 
   const users = new Users({
    _id: new mongoose.Types.ObjectId(), 
    name: req.body.name,
    phoneno:req.body.phoneno,  
    status:true,    
    userImage: req.file.path.replace('public\\','') 
  });
  users
    .save()
    .then(result => {       
      res.status(200).json({        
        message: "Created user successfully",
        createdUser: {         
            name: result.name,
            phoneno: result.phoneno,
            status:result.status,
            userImage:result.userImage,
            _id: result._id,
            request: {
                type: 'GET',
                url:url + "/user/" + result._id
            }
        }
      });
   //   io.emit("user"    ,message);   
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


router.post("/subscript", (req, res, next) => {
      var friend = { id:  req.body.subscript_id };

    /* console.log("put " +  req.body.subscript_id )
    console.log("put userId " +  req.body.userId) */

    Users.findByIdAndUpdate( req.body.userId  ,
      {$push: {subscript: friend}},  
      function(err, doc) {
          if(err){
          console.log(err);
          }else{
            res.status(200).json({
              message: doc,          
          });
          }
      }
    );

});



router.post("/follow", (req, res, next) => {
  var friend = { id:  req.body.follow_id };
      Users.findByIdAndUpdate( req.body.userId  ,
      {$push: {follow: friend}},  
      function(err, doc) {
          if(err){
          console.log(err);
          }else{
            res.status(200).json({
              message: doc,          
          });
          }
      });

});

router.post("/projects", (req, res, next) => {
  var friend = { id:  req.body.follow_id };
      Users.findByIdAndUpdate( req.body.userId  ,
      {$push: {projects: friend}},  
      function(err, doc) {
          if(err){
          console.log(err);
          }else{
            res.status(200).json({
              message: doc,          
          });
          }
      });

});



router.get("/:userId", (req, res, next) => {
  const id = req.params.userId;
  Users.findById(id)
    .select('name detail _id userImage')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            user: doc,
            request: {
                type: 'GET',
                url: url + '/user'
            }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});


router.post("/joinuser" , (req, res, next) => {  
  console.log("Created user join project  ",req.body.userid)
  console.log("Created user join project  ")
   var io = req.app.get('socketio');
   let message ={"group_name":"a",
   "remain":"ทดสอบ",  
   } 
   const modeldata = new ModelProjectRef({
     _id: new mongoose.Types.ObjectId(), 
     userid: req.body.userid,
     projectid: req.body.projectid,     
     name: "",           
     noti:0,  
     status:true,
     active:false
   });
   modeldata
     .save()
     .then(result => {       
       res.status(201).json({        
         message: "Created user join project  successfully",
         modeldata: {         
          userid: result.userid,
          projectid: result.projectid,            
          name:result.name,
          status:result.status,              
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
 

router.get("/joinprojectid/:joinprojectid", (req, res, next) => { 
  var ObjectId = require('mongodb').ObjectID;  
  ModelProjectRef.aggregate([
      { $match : { 'userid' :  ObjectId(  req.query.userid)  }
      }   ,    
         { $lookup:  {
            from: 'projects',
            localField: 'projectid',
            foreignField: '_id', 
             as: 'projects'
       },                  
      },         
    ]) .exec().then(function(data){       
     res.status(200).json(data );
     }).catch(function(err){
     console.log(err)
     });

});

 
router.patch("/:userId", (req, res, next) => {
  const id = req.params.userId;
 
  var friend = { firstName: 'Harry', lastName: 'Potter' };
 

  Users.update({ _id: id }, { $push: { subscript : friend } })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'User updated',
          request: {
              type: 'GET',
              url: url +  '/user/' + id
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

router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;
  Users.remove({ _id: id })
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
