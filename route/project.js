const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const Projects = require("../models/project");
const Billlists =require("../models/billlist");
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
  console.log('load project')
    Projects.find()
    .select("owner name _id detail image_url projecttype")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Project: docs.map(doc => {        
          return {
            owner: doc.owner,
            name: doc.name,
            detail: doc.detail,
            projecttype:doc.projecttype,
            image_url: doc.image_url,            
            _id: doc._id,
            request: {
              type: "GET",
              url: url + "/projects/" + doc._id
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


router.get("/ownerid/:ownerid", (req, res, next) => {
  console.log('load project owner', req.query.ownerid )
   
  /* var condition =condition={"owner": ObjectId(req.query.owner)   };   */
    Projects.find({'owner':req.query.ownerid})
    .select("owner name _id detail image_url projecttype")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Project: docs.map(doc => {        
          return {
            owner: doc.owner,
            name: doc.name,
            detail: doc.detail,
            projecttype:doc.projecttype,
            image_url: doc.image_url,            
            _id: doc._id,
            
            request: {
              type: "GET",
              url: url + "/projects/" + doc._id
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



router.get("/projectid/:projectid", (req, res, next) => {
  console.log('load project projectid', req.query.projectid )
   
  /* var condition =condition={"owner": ObjectId(req.query.owner)   };   */
    Projects.find({'_id':req.query.projectid}).sort({createdAt: 1})
    .select("owner name _id detail image_url projecttype")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Project: docs.map(doc => {        
          return {
            owner: doc.owner,
            name: doc.name,
            detail: doc.detail,
            projecttype:doc.projecttype,
            image_url: doc.image_url,            
            _id: doc._id,
            request: {
              type: "GET",
              url: url + "/projects/" + doc._id
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
 console.log("add project");
  var io = req.app.get('socketio');
  let message ={"group_name":"a",
  "remain":"ทดสอบ",  
  }
  const project = new Projects({
    _id: new mongoose.Types.ObjectId(), 
    owner: req.body.owner,
    name: req.body.name,
    detail: req.body.detail,
    projecttype:req.body.projecttype,
    image_url: req.file.path.replace('public\\','') 
  });
  project
    .save()
    .then(result => {       
      res.status(201).json({        
        message: "Created user successfully",
        createdUser: {         
            owner: result.owner,
            name: result.name,
            detail:result.detail,
            _id: result._id,
            request: {
                type: 'GET',
                url:url + "/project/" + result._id
            }
        }
      });
      io.emit("project"    ,message);   
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


router.get("/:userId", (req, res, next) => {
  const id = req.params.userId;
  console.log('load project')
  Project.findById(id)
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
 


router.delete("/:delete/billlist", (req, res, next) => {
  console.log("billlist id" + req.query.projectid )
   const id = req.query.projectid;
   Billlists.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'billlist deleted',
          request: {
              type: 'POST',
              url: url + '/billlist',
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


router.post("/billlist", (req, res, next) => {
   
  var io = req.app.get('socketio');
  let message ={"group_name":"a",
  "remain":"ทดสอบ",  
  } 
  const billlist = new Billlists({
    _id: new mongoose.Types.ObjectId(),  
    projectid: req.body.projectid,
    detail: req.body.detail,
    roomlist: [req.body.roomlist], 
    notify:false,         
    actived: true,
   
   
 });
 billlist
    .save()
    .then(result => {       
      res.status(201).json({        
        message: "Created bill list successfully",
        level: {  
            _id: result._id,       
            projectid:result.projectid,
            detail:result.detail,
            roomlist:result.roomlist, 
            notify:result.notify, 
            actived:result.actived,                      
            request: {
                type: 'GET',
                url:url + "/billlist/" + result._id
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



module.exports = router;
