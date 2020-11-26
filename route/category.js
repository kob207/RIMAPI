const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const Components = require("../models/category");
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
  Components.find()
  /* name: {type: String },   
  icon: {type: String },
  member: {type: Array},
  permission: {type: Array},       
  detail: {type: String}, */


    .select("name detail _id member permission icon")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Categories: docs.map(doc => {        
          return {
            name: doc.name,
            detail: doc.detail,
            member: doc.member,
            permission: doc.permission,
            img: doc.icon,            
            _id: doc._id,
            request: {
              type: "GET",
              url: url + "/Categories/" + doc._id
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

router.post("/new"  , (req, res, next) => {
 console.log("add component");
  var io = req.app.get('socketio');
  let message ={"component":"a",
  "remain":"ทดสอบ",  
  }  

  const components = new Components({
    _id: new mongoose.Types.ObjectId(),  
    name: req.body.name,
    detail:req.body.detail,
    member: [],
    permission: [],
    icon: 'FontAwesomeIcons.birthdayCake'  

     
  });
  components
    .save()
    .then(result => {       
      res.status(201).json({        
        message: "Created Component successfully",
        createdComponent: {         
            name: result.name,
            detail: result.detail,
            member:result.member ,
            permission: result.permission,
            _id: result._id,
            request: {
                type: 'GET',
                url:url + "/component/" + result._id
            }
        }
      });
      io.emit("component"    ,message);   
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

 

    Components.findByIdAndUpdate( req.body.userId  ,
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
  Components.findByIdAndUpdate( req.body.userId  ,
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


router.get("/:userId", (req, res, next) => {
  const id = req.params.userId;
  Components.findById(id)
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

router.patch("/:userId", (req, res, next) => {
  const id = req.params.userId;
 
  var friend = { firstName: 'Harry', lastName: 'Potter' };
 

  Components.update({ _id: id }, { $push: { subscript : friend } })
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
  Components.remove({ _id: id })
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
