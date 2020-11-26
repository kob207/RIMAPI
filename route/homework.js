const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const Homeworks = require("../models/homework");
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


/* owner: result.owner,
name: result.name,
detail:result.detail, */


 

router.get("/", (req, res, next) => {
  // print("showall")
   // Homeworks.find()
   Homeworks.find(  )
    .select("_id ownerid subjectid subject descryption createdate status image_url")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Homeworks: docs.map(doc => {        
          return {
            _id: doc._id,
            ownerid:doc.ownerid,
            subjectid:doc.subjectid,
            subject:doc.subject,
            duedate:doc.duedate,
            descryption:doc.descryption,
            createdate:doc.createdate,
            status:doc.status,
            image_url:doc.image_url, 
             request: {
              type: "GET",
              url: url + "/homework/" + doc._id
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



router.get("/:subjectid", (req, res, next) => {
  Homeworks.find( {subjectid: req.query.subjectid})
  .select("_id ownerid subjectid subject descryption createdate status image_url")
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      Homeworks: docs.map(doc => {        
        return {
          _id: doc._id,
          ownerid:doc.ownerid,
          subjectid:doc.subjectid,
          subject:doc.subject,
          duedate:doc.duedate,
          descryption:doc.descryption,
          createdate:doc.createdate,
          status:doc.status,
          image_url:doc.image_url, 
           request: {
            type: "GET",
            url: url + "/homework/" + doc._id
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

 




router.post("/new", upload.single('image_url'), (req, res, next) => {
 console.log("add  subject img");
  var io = req.app.get('socketio');
  let message ={"group_name":"a",
  "remain":"ทดสอบ",  
  } 
  const homework = new Homeworks({
    _id: new mongoose.Types.ObjectId(), 
    ownerid: req.body.ownerid,
    subjectid: req.body.subjectid,
    subject: req.body.subject,
    descryption: req.body.descryption,
    duedate: req.body.duedate,
    createdate: new Date().toJSON() ,
    status:true,
    image_url: req.file.path.replace('public\\','') 
  });
  homework
    .save()
    .then(result => {       
      res.status(201).json({        
        message: "Created user successfully",
        createdUser: {         
            ownerid: result.ownerid,
            subjectid: result.subjectid,
            subject:result.subject,
            descryption:result.descryption,
            createdate:result.createdate,
            duedate:result.duedate,
            status:result.status,
            _id: result._id,
            request: {
                type: 'GET',
                url:url + "/homework/" + result._id
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

router.post("/noimg" , (req, res, next) => {
    console.log("add  home work no image " + req.body.ownerid);
     var io = req.app.get('socketio');
     let message ={"group_name":"a",
     "remain":"ทดสอบ",  
     } 
     const homework = new Homeworks({
       _id: new mongoose.Types.ObjectId(), 
       ownerid: req.body.ownerid,
       subjectid: req.body.subjectid,
       subject: req.body.subject,
       descryption: req.body.descryption,
       duedate: req.body.duedate,
       createdate: new Date().toJSON() ,
       status:true,
       image_url: ''
     });
     homework
       .save()
       .then(result => {       
         res.status(201).json({        
           message: "Created user successfully",
           homework: {         
               ownerid: result.ownerid,
               subjectid: result.subjectid,
               subject:result.subject,
               descryption:result.descryption,
               createdate:result.createdate,
               status:result.status,
               duedate:result.duedate,
               _id: result._id,
               request: {
                   type: 'GET',
                   url:url + "/homework/" + result._id
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

router.post("/subscript", (req, res, next) => {
      var friend = { id:  req.body.subscript_id };

    /* console.log("put " +  req.body.subscript_id )
    console.log("put userId " +  req.body.userId) */

    Project.findByIdAndUpdate( req.body.userId  ,
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
  Project.findByIdAndUpdate( req.body.userId  ,
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
  Project.findByIdAndUpdate( req.body.userId  ,
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





router.patch("/:userId", (req, res, next) => {
  const id = req.params.userId;
 
  var friend = { firstName: 'Harry', lastName: 'Potter' };
 

  Project.update({ _id: id }, { $push: { subscript : friend } })
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
