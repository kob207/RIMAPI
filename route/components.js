const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const Component = require("../models/component");
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
  Component.find()
    .select("name price _id componentImage descryption")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        components: docs.map(doc => {        
          return {
            name: doc.name,
            price: doc.price,
            descryption: doc.descryption,
            img: doc.componentImage,            
            _id: doc._id,

            request: {
              type: "GET",
              url: url + "/component/" + doc._id
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

router.post("/", upload.single('componentImage'),  (req, res, next) => {
  console.log("start upload ");
 // console.log("Received file" + req.file.path);
/*   req.files.forEach((e) => {
    console.log(e.filename);
    }); */
 
  var io = req.app.get('socketio');
  let message ={"group_name":"a",
  "remain":"ทดสอบ",
  
  }   
  console.log("xxxxx upload ",req.body);
  const component = new Component({
    _id: new mongoose.Types.ObjectId(), 
    name: req.body.name,
    price: req.body.price,
    descryption:req.body.descryption,
    status:true,
    componentImage: req.file.path.replace('public\\','') 
  });
  component
    .save()
    .then(result => {
     // console.log(result);  
     
      res.status(201).json({
        
        message: "Created component successfully",
        createdComponent: {
         
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
                type: 'GET',
                url:url + "/components/" + result._id
            }
        }
      });
      io.emit("subjects"    ,message);   
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:componentId", (req, res, next) => {
  const id = req.params.componentId;
  Component.findById(id)
    .select('name price _id componentImage descryption')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          component: doc,
            request: {
                type: 'GET',
                url: url + '/components'
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

router.patch("/:componentId", (req, res, next) => {
  const id = req.params.componentId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Component.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'component updated',
          request: {
              type: 'GET',
              url: url +  '/components/' + id
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

router.delete("/:componentId", (req, res, next) => {
  const id = req.params.componentId;
  Component.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Component deleted',
          request: {
              type: 'POST',
              url: url + '/components',
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
