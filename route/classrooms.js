const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const Classrooms = require("../models/classrooms");
 
const Checklists = require("../models/checklist");
const Billlists = require("../models/billlist");
 
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
    console.log("get all class")
    Classrooms.find(  )
    .select("_id projectid levelid name detail noti status statusclose image_url")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Classrooms: docs.map(doc => {        
          return {
               _id: doc._id,
               projectid:doc.projectid,
               levelid:doc.levelid,
               name:doc.name, 
               detail: doc.detail,         
               noti: doc.noti,
               status:doc.status,
               statusclose:doc.statusclose,
               image_url: doc.image_url,   
             request: {
              type: "GET",
              url: url + "/Classrooms/" + doc._id
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



   router.get("/roomname:roomname", (req, res, next) => {   
    console.log("get all class")
    //5f02b3249dadaa5bd29f9b9c
    Classrooms.find({name: req.query.name,projectid: req.query.projectid}   )
    .select("_id projectid levelid name detail noti status statusclose image_url")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Classrooms: docs.map(doc => {        
          return {
               _id: doc._id,
               projectid:doc.projectid,
               levelid:doc.levelid,
               name:doc.name, 
               detail: doc.detail,         
               noti: doc.noti,
               status:doc.status,
               statusclose:doc.statusclose,
               image_url: doc.image_url,   
             request: {
              type: "GET",
              url: url + "/Classrooms/" + doc._id
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


   router.get("/roomlikename:roomlikename", (req, res, next) => {   
   
  // var nn ="/"+ req.query.name.toString().trim() + "/" 
    var nn =  req.query.name.toString().trim()  
    console.log("get all class" + nn)
    //5f02b3249dadaa5bd29f9b9c
    Classrooms.find({name:new RegExp( nn,  'i') ,projectid: req.query.projectid}   )
    .select("_id projectid levelid name detail noti status statusclose image_url water")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Classrooms: docs.map(doc => {        
          return {
               _id: doc._id,
               projectid:doc.projectid,
               levelid:doc.levelid,
               name:doc.name, 
               detail: doc.detail,         
               noti: doc.noti,
               status:doc.status,
               statusclose:doc.statusclose,
               image_url: doc.image_url,
               water:doc.water,   
             request: {
              type: "GET",
              url: url + "/Classrooms/" + doc._id
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



   router.get("/checklists/:classroomid", (req, res, next) => {       
    Checklists.find({classroomid: req.query.classroomid}  )
    .select("_id classroomid actived notify detail createdAt")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        checklists: docs.map(doc => {        
          return {
               _id: doc._id,               
               classroomid: doc.classroomid,
               detail:doc.detail,
               actived:doc.actived,
               notify: doc.notify, 
               createdAt:doc.createdAt,  
             request: {
              type: "GET",
              url: url + "/checklists/" + doc._id
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


    


   router.get("/roomlists/:projectid", (req, res, next) => {       
     console.log("room list ",req.query.projectid)
     Billlists.find({projectid: req.query.projectid}  ).sort({createdAt: -1})
    .select("_id projectid actived notify detail createdAt")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        billlist: docs.map(doc => {        
          return {
               _id: doc._id,               
               projectid: doc.projectid,
               detail:doc.detail,
               actived:doc.actived,
               notify: doc.notify, 
               createdAt:doc.createdAt,  
             request: {
              type: "GET",
              url: url + "/roomlists/" + doc._id
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



   router.get("/billrecode/:billid", (req, res, next) => {       
    console.log("bill record ",req.query.billid)
    Billlists.find({_id: req.query.billid}  )
   .select("_id projectid actived roomlist notify detail createdAt")
   .exec()
   .then(docs => {
     const response = {
       count: docs.length,
       billlist: docs.map(doc => {        
         return {
              _id: doc._id,               
              projectid: doc.projectid,
              detail:doc.detail,
              roomlist:doc.roomlist,
              actived:doc.actived,
              notify: doc.notify, 
              createdAt:doc.createdAt,  
            request: {
             type: "GET",
             url: url + "/roomlists/" + doc._id
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




router.get("/building:levelid", (req, res, next) => {   
  console.log("get classroom by level", req.query.levelid)
    Classrooms.find( {levelid: req.query.levelid})
  .select("_id projectid levelid name detail noti status statusclose image_url")
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      Classrooms: docs.map(doc => {        
        return {
             _id: doc._id,
             projectid:doc.projectid,
             levelid:doc.levelid,
             name:doc.name, 
             detail: doc.detail,         
             noti: doc.noti,
             status:doc.status,
             statusclose:doc.statusclose,
             image_url: doc.image_url,   
           request: {
            type: "GET",
            url: url + "/Classrooms/" + doc._id
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

 
router.get("/project:projectid", (req, res, next) => {   
    console.log("get classroom by Project id", req.query.projectid)
      Classrooms.find( {projectid: req.query.projectid}).sort({name: 1})
    .select("_id projectid levelid name detail noti status statusclose image_url water")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Classrooms: docs.map(doc => {        
          return {
               _id: doc._id,
               projectid:doc.projectid,
               levelid:doc.levelid,
               name:doc.name, 
               detail: doc.detail,
               water:doc.water,         
               noti: doc.noti,
               status:doc.status,
               statusclose:doc.statusclose,
               image_url: doc.image_url,   
                


             request: {
              type: "GET",
              url: url + "/Classrooms/" + doc._id
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
    console.log("add  subject img");
     var io = req.app.get('socketio');
     let message ={"group_name":"a",
     "remain":"ทดสอบ",  
     } 
     const classroom = new Classrooms({
       _id: new mongoose.Types.ObjectId(),  
      projectid: req.body.projectid,
      levelid: req.body.levelid,
      name: req.body.name, 
      detail: req.body.detail,         
      noti: 0,
      status:true,
      statusclose: false,
      image_url: req.file.path.replace('public\\','') 
    });
       classroom
       .save()
       .then(result => {       
         res.status(201).json({        
           message: "Created classroom successfully",
           level: {  
               _id: result._id,       
               projectid:result.projectid,
               levelid:result.levelid,
               name:result.name, 
               detail: result.detail,         
               noti: result.noti,
               status:result.status,
               statusclose:result. statusclose,
               image_url: result.image_url,          
               request: {
                   type: 'GET',
                   url:url + "/classrooms/" + result._id
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



   router.post("/autonew", (req, res, next) => {
    console.log("add  autonew img " +  req.body.projectid);
    console.log("add  autonew img " +  req.params.projectid);
    var io = req.app.get('socketio');
    let message ={"group_name":"a",
    "remain":"ทดสอบ",  
    } 
    const classroom = new Classrooms({
      _id: new mongoose.Types.ObjectId(),  
     projectid: req.body.projectid,
     levelid: req.body.levelid,
     name: req.body.name, 
     detail: req.body.detail,         
     noti: 0,
     status:true,
     statusclose: false,
    
   });
      classroom
      .save()
      .then(result => {       
        res.status(201).json({        
          message: "Created classroom successfully",
          level: {  
              _id: result._id,       
              projectid:result.projectid,
              levelid:result.levelid,
              name:result.name, 
              detail: result.detail,         
              noti: result.noti,
              status:result.status,
              statusclose:result. statusclose,
              image_url: result.image_url,          
              request: {
                  type: 'GET',
                  url:url + "/classrooms/" + result._id
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



 router.post("/checklists", (req, res, next) => {
   
     var io = req.app.get('socketio');
     let message ={"group_name":"a",
     "remain":"ทดสอบ",  
     } 
     const checklist = new Checklists({
       _id: new mongoose.Types.ObjectId(),  
       classroomid: req.body.classroomid,
       detail: req.body.detail,
       memberlist: [req.body.memberlist], 
       notify:false,         
       actived: true,
      
      
    });
    checklist
       .save()
       .then(result => {       
         res.status(201).json({        
           message: "Created checklist successfully",
           level: {  
               _id: result._id,       
               classroomid:result.classroomid,
               detail:result.detail,
               memberlist:result.memberlist, 
               notify:result.notify, 
               actived:result.actived,                      
               request: {
                   type: 'GET',
                   url:url + "/checklist/" + result._id
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





router.patch("/pushchecklist", (req, res, next) => {   
  console.log("update member") 
  const id = "5ef31f5b0738a66abe7117b2"; //req.params.userId; 
  var friend = { memberid: id, membername: 'Potter' ,status:false};
  Checklists.update({ _id: id }, { $push: { memberlist : friend } })
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





module.exports = router;
