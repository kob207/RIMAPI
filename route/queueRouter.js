const express = require("express");
const bodyParser = require("body-parser");
const connectdb = require("../dbconnect");
const Queue = require("../models/Queue");
const Mqueue=require("../models/Mqueue");
const router = express.Router();

 


router.route("/").get((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  connectdb.then(db => {
    let data = Queue.find({ message: "Anonymous" });
    Queue.find({}).then(queue => {
      res.json(queue);
    });
  });
});

router.get('/GROUP', async (req, res) => {
  console.log("req.query",req.body)
  
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  connectdb.then(db => {
   // let data = Queue.find({ message: "Anonymous" });
    
   Mqueue.find({ "group_name" : req.body.group_name}).sort({createdAt: -1}).limit(1).then(queue => {
      res.json(queue);
     // console.log("req.groupname", res.json(queue))

    });
  });
});

router.get('/BILLBOARD_ALL', async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  connectdb.then(db => {
    let data = Queue.find({ message: "Anonymous" });
    Mqueue.find({}).sort({group_name:1}).then(queue => {
      res.json(queue);
    });
  });
});
 
/* router.delete('/DELETE', async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  Mqueue.findById( { _id :  '5e86ad9eca8f5650d45a179a'} ).then(queue=>{
    if(queue) {  
    queue.remove( );
    }
  });
  res.json("OK");  
 
 
}); */

router.delete("/delete",function(req, res) {
  var io = req.app.get('socketio');
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;  
  let message ={"group_name":"A",
        "remain":0,
        "current": 0,
        "last": 0 ,
        "detail":'...',
        }  
 
   Mqueue.deleteMany(
    {
      _id: {
        $in: [
          "5e86ad9eca8f5650d45a179c",
          "5e86ad9eca8f5650d45a179d",
          "5e86ad9eca8f5650d45a179e",
          "5e86ad9eca8f5650d45a179f"
          
        ]
      }
    },
    function(err, result) {
    
      io.emit("remain_group",message  ); 
      if (err) {
      
        res.send(err);
      } else {
        
        let QueueMessage = new Mqueue({ 
          _id: '5e86ad9eca8f5650d45a179a'  ,        
          group_name:"A",
          remain:"0",
          current: "0",
          detail:"ไม่มีคิวในระบบ กลุ่ม ฺA  ระบบเปิดรับ คิวตั้งแต่เวลา 9:00-16.00 ทุกวันทำการ ",
          last:"0", 
        });
        Mqueue.findByIdAndUpdate( '5e86ad9eca8f5650d45a179a' , QueueMessage ).then(queue => {
         if(!queue) {           
          connectdb.then(db => { 
          QueueMessage.save();             
          }); 
         }});
       
         let QueueMessageb = new Mqueue({ 
          _id: '5e86ad9eca8f5650d45a179b'  ,        
          group_name:"B",
          remain:"0",
          current: "0",
          detail:"ไม่มีคิวในระบบ กลุ่ม ฺB ระบบเปิดรับ คิวตั้งแต่เวลา 9:00-16.00 ทุกวันทำการ ",
          last:"0", 
        });
        Mqueue.findByIdAndUpdate(  '5e86ad9eca8f5650d45a179b' , QueueMessageb ).then(queue => {
         if(!queue) {           
          connectdb.then(db => { 
            QueueMessageb.save();             
          }); 
         }});
        

        
        res.send(result);
      }
    }
  );  
});




router.put('/REMAIN', function(req, res, next) {
  var io = req.app.get('socketio');
 
     res.setHeader("Content-Type", "application/json");
     res.statusCode = 200;  
         
      let message ={"group_name":req.body.group_name,
        "remain":req.body.remain,
        "current": req.body.current,
        "last": req.body.last ,
        "detail":req.body.detail,
        }     
        /*  console.log("remain_group_" + req.body.group_name.toLowerCase()) 
         console.log(" req.body. remain " +  req.body.remain )  
         console.log(" req.body. current " +  req.body.current )  
         console.log(" req.body. last " +  req.body.last )    */
         io.emit("remain_group_" +   req.body.group_name.toLowerCase()   ,message); 
         io.emit("remain_group"  ,message); 
         let q_id   = "5e86ad9eca8f5650d45a179" + req.body.group_name.toLowerCase() ;
       let QueueMessage = new Mqueue({ 
         _id: q_id  ,
         message:   req.body.msg , 
         group_name:req.body.group_name,
         remain:req.body.remain,
         current: req.body.current,
         detail:req.body.detail,
         last: req.body.last, 
       });
       Mqueue.findByIdAndUpdate( q_id , QueueMessage )
        .then(queue => {
        if(!queue) {           
         connectdb.then(db => { 
         QueueMessage.save();             
         }); 
        }
       
      })
      res.json(QueueMessage);   
   } );
 




module.exports = router;
