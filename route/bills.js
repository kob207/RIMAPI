const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const expens_bill = require("../models/expenseBill");
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




 

router.get("/billbyid:billbyid", (req, res, next) => {
  
  expens_bill.find( {roomid: req.query.roomid}).sort({createdAt: -1})

    .select("projectid billid water_meter water_unit water_price common_fee oth_expense oth_details bill_type status_pay")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        expens_bill: docs.map(doc => {        
          return {
            projectid: doc.projectid,
            billid: doc.billid,
            ownerid:doc.ownerid,
            roomid:doc.roomid,
            water_meter: doc.water_meter,
            water_unit:doc.water_unit,
            water_price:doc.water_price,
            common_fee:doc.common_fee,
            oth_expense: doc.oth_expense,
            oth_details: doc.oth_details, 
            bill_type: doc.bill_type,  
            status_pay: doc.status_pay,   
            _id: doc._id,


            request: {
              type: "GET",
              url: url + "/expens_bill/" + doc._id
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

router.get("/billbyroomname:billbyroomname", (req, res, next) => {
  
  expens_bill.find( {roomid: req.query.roomid}).sort({createdAt: -1})

    .select("projectid billid water_meter water_unit water_price common_fee oth_expense oth_details bill_type status_pay")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        expens_bill: docs.map(doc => {        
          return {
            projectid: doc.projectid,
            billid: doc.billid,
            ownerid:doc.ownerid,
            roomid:doc.roomid,
            water_meter: doc.water_meter,
            water_unit:doc.water_unit,
            water_price:doc.water_price,
            common_fee:doc.common_fee,
            oth_expense: doc.oth_expense,
            oth_details: doc.oth_details, 
            bill_type: doc.bill_type,  
            status_pay: doc.status_pay,   
            _id: doc._id,


            request: {
              type: "GET",
              url: url + "/expens_bill/" + doc._id
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


router.get("/roomidpay:roomidpay", (req, res, next) => {
  console.log("room and statuspay ",req.query.statuspay);
  expens_bill.find( {roomid: req.query.roomid,status_pay: false}).sort({createdAt: -1})
    .select("projectid billid water_meter water_unit water_price common_fee oth_expense oth_details bill_type status_pay")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        expens_bill: docs.map(doc => {        
          return {
            projectid: doc.projectid,
            billid: doc.billid,
            ownerid:doc.ownerid,
            roomid:doc.roomid,
            water_meter: doc.water_meter,
            water_unit:doc.water_unit,
            water_price:doc.water_price,
            common_fee:doc.common_fee,
            oth_expense: doc.oth_expense,
            oth_details: doc.oth_details, 
            bill_type: doc.bill_type,  
            status_pay: doc.status_pay,   
            status_approve: doc.status_approve,   
            _id: doc._id,


            request: {
              type: "GET",
              url: url + "/expens_bill/" + doc._id
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




router.get("/billbyjobid:billbyjobid", (req, res, next) => {
  console.log("room and job ",req.query.roomid);
  expens_bill.find( {roomid: req.query.roomid,
    billid: req.query.billid ,
    projectid: req.query.projectid}).sort({createdAt: -1})

    .select("projectid billid water_meter water_unit water_price common_fee oth_expense oth_details bill_type status_pay")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        expens_bill: docs.map(doc => {        
          return {
            projectid: doc.projectid,
            billid: doc.billid,
            ownerid:doc.ownerid,
            roomid:doc.roomid,
            water_meter: doc.water_meter,
            water_unit:doc.water_unit,
            water_price:doc.water_price,
            common_fee:doc.common_fee,
            oth_expense: doc.oth_expense,
            oth_details: doc.oth_details, 
            bill_type: doc.bill_type,  
            status_pay: doc.status_pay,   
            _id: doc._id,


            request: {
              type: "GET",
              url: url + "/expens_bill/" + doc._id
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

router.post("/add:manualbills", (req, res, next) => {
  console.log("manua bills" + req.body.projectid);
 var io = req.app.get('socketio');
 let message ={"group_name":"a",
 "remain":"ทดสอบ",  
 } 
 const checklist = new expens_bill({
   _id: new mongoose.Types.ObjectId(), 
   projectid:  req.body.projectid,
   billid:  req.body.billid,
   roomid:req.body.roomid,
   ownerid:req.body.ownerid,
   water_meter: req.body.water_meter,
   water_unit:  req.body.water_unit,
   water_price : req.body.water_price,
   common_fee :  req.body.common_fee,
   oth_expense :  req.body.oth_expense,
   oth_details:   req.body.oth_details,
   bill_type:req.body.bill_type,
   roomname:req.body.roomname
  
});
checklist
   .save()
   .then(result => {       
     res.status(201).json({        
       message: "Created checklist successfully",
       level: { 
         _id: result._id,
           projectid:result.projectid,
           billid:result.billid,
           roomid:result.roomid,
           ownerid:res.ownerid,
           water_meter: result.water_meter,
           water_unit:  result.water_unit,
           water_price : result.water_price,
           common_fee :  result.common_fee,
           oth_expense :  result.oth_expense,
           oth_details:   result.oth_details,
           bill_type:req.body.bill_type,
           request: {
               type: 'GET',
               url:url + "/expens_bill/" + result._id
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


router.post("/add:newbills", (req, res, next) => {
   console.log("new bills" + req.body.projectid);
  var io = req.app.get('socketio');
  let message ={"group_name":"a",
  "remain":"ทดสอบ",  
  } 
  const checklist = new expens_bill({
    _id: new mongoose.Types.ObjectId(), 
    projectid:  req.body.projectid,
    billid:  req.body.billid,
    roomid:req.body.roomid,
    ownerid:req.body.ownerid,
    water_meter: req.body.water_meter,
    water_unit:  req.body.water_unit,
    water_price : req.body.water_price,
    common_fee :  req.body.common_fee,
    oth_expense :  req.body.oth_expense,
    oth_details:   req.body.oth_details,
    
   
 });
 checklist
    .save()
    .then(result => {       
      res.status(201).json({        
        message: "Created checklist successfully",
        level: { 
          _id: result._id,
            projectid:  result.projectid,
            billid:  result.billid,
            roomid:result.roomid,
            ownerid:result.ownerid,
            water_meter: result.water_meter,
            water_unit:  result.water_unit,
            water_price : result.water_price,
            common_fee :  result.common_fee,
            oth_expense :  result.oth_expense,
            oth_details:   result.oth_details,
            request: {
                type: 'GET',
                url:url + "/expens_bill/" + result._id
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

     

router.delete("/delete:monthlybill", (req, res, next) => {
  const id = req.query.billid;
  console.log("delete xxxxxx  "  + id)
  expens_bill.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Bill deleted',
          request: { 
              type: 'POST',
              url: url + '/bill',
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


 

router.post("/delete:billbyid", (req, res, next) => {
  console.log("delete room id by bill " )
  const id = req.query.billid;
  console.log("delete room id by bill "  + req.body.billid)
  expens_bill.remove({
    billid:  req.body.billid , 
    projectid: req.body.projectid,
    roomid:  req.body.roomid  })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Bill deleted',
          request: {
              type: 'POST',
              url: url + '/bill',
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



router.patch("/pushcheckbill", (req, res, next) => {   
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

