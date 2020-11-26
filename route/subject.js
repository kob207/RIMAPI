const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const Subjects = require("../models/subject");
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




 

router.get("/:levelid", (req, res, next) => {
  console.log("show  subject by level",req.query.levelid);
  Subjects.find( {levelid: req.query.levelid})
    .select("ownerid name _id levelid detail image_url subjecttype credit")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Subject: docs.map(doc => {        
          return {
            ownerid: doc.ownerid,
            name: doc.name,
            detail: doc.detail,
            levelid:doc.levelid,
            subjecttype:doc.subjecttype,
            credit:doc.credit,
            image_url: doc.image_url,            
            _id: doc._id,
            request: {
              type: "GET",
              url: url + "/subject/" + doc._id
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

router.get("/", (req, res, next) => {
  Subjects.find()
  .select("ownerid name _id levelid detail image_url subjecttype credit")
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      Subject: docs.map(doc => {        
        return {
          ownerid: doc.ownerid,
          name: doc.name,
          detail: doc.detail,
          levelid:doc.levelid,
          subjecttype:doc.subjecttype,
          credit:doc.credit,
          image_url: doc.image_url,            
          _id: doc._id,
          request: {
            type: "GET",
            url: url + "/subject/" + doc._id
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



router.post("/new", upload.single('image_url'), (req, res, next) => {
 console.log("add subject");
  var io = req.app.get('socketio');
  let message ={ 
  "remain": req.body.realtime_key   ,  
  }
  const subject = new Subjects({
    _id: new mongoose.Types.ObjectId(), 
    ownerid: req.body.ownerid,
    name: req.body.name,
    levelid:req.body.levelid,
    detail: req.body.detail,
    subjecttype:req.body.subjecttype,
    credit:req.body.credit,     
    image_url: req.file.path.replace('public\\','') 
  });
  subject
    .save()
    .then(result => {       
      res.status(201).json({        
        message: "Created user successfully",
        createdUser: {         
            ownerid: result.ownerid,
            name: result.name,
            detail:result.detail,
            subjecttype:result.subjecttype,          
            levelid:result.levelid,
            _id: result._id,
            request: {
                type: 'GET',
                url:url + "/subject/" + result._id
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


    

router.delete("/:subjectId", (req, res, next) => {
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

