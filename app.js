//require the express module
const express = require("express");
const app = express();
const dateTime = require("simple-datetime-formater");
const bodyParser = require("body-parser");
const queueRouter = require("./route/queueRouter");
const loginRouter = require("./route/loginRoute");
const componentsRoutes = require("./route/components");
const orderRoutes = require("./route/orders")
const board = require("./route/board")
const users  = require("./route/users")
const project  = require("./route/project")
const categoryRoutes= require("./route/category")
const homeworks= require("./route/homework")
const levels= require("./route/levels")
const classrooms= require("./route/classrooms")

const subjects= require("./route/subject")
const ParentRef= require("./route/parentRef")
const Course= require("./route/course")
const Studentlist= require("./route/studentchecklist")

const Bills= require("./route/bills")

require('dotenv').config();
//require the http module
const http = require("http").Server(app);

// require the socket.io module
const io = require("socket.io");

const port = 5050;

//bodyparser middleware
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");  
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS'); 
  next();
});

socket = io(http);

//routes
 
app.use("/queue", queueRouter) ;
app.use("/login", loginRouter) ;
app.use("/components", componentsRoutes);
app.use("/orders", orderRoutes);
app.use("/board", board);
app.use("/users", users);
app.use("/category", categoryRoutes);
app.use("/projects", project);
app.use("/homework", homeworks);
app.use("/levels", levels);
app.use("/classroom", classrooms);
app.use("/subject", subjects);
app.use("/parentref", ParentRef);
app.use("/course", Course);
app.use("/studentlist", Studentlist);
app.use("/bills", Bills);

app.set('socketio', socket);

//set the express.static middleware
app.use(express.static(__dirname + "/public"));

//integrating socketio


//database connection
const Queue = require("./models/Queue");
const connect = require("./dbconnect");

//setup event listener
socket.on("connection", socket => {
  console.log("user connected");

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  //Someone is typing
  socket.on("typing", data => {
    console.log("user connected..");
    socket.broadcast.emit("notifyTyping", {
      user: data.user,
      message: data.message
    });
  });

  //when soemone stops typing
  socket.on("stopTyping", () => {
    socket.broadcast.emit("notifyStopTyping");
  });

  socket.on("Queue message", function(msg) {
    console.log("message: " + msg);

    //broadcast message to everyone in port:5000 except yourself.
 //---- socket.broadcast.emit("received", { message: msg });

    //save Queue to the database
    connect.then(db => {
      console.log("connected correctly to the server");
      let QueueMessage = new Queue({ 
        message: msg, 
        sender: "Anonymous",
        groupname:'A' ,
        status_read:false,
        queueno:5});
        QueueMessage.save();
    });

  /*   return QueueMessage */
  });




  socket.on("Queue show", function(msg) {
    const myObjStr = JSON.stringify(msg);
    console.log("message: " +  JSON.parse(myObjStr).msg )
    //----   socket.broadcast.emit("received", { message:  JSON.parse(myObjStr).msg  });   
    connect.then(db => {
      console.log("connected correctly to the server");
      let QueueMessage = new Queue({ 
        message:  JSON.parse(myObjStr).msg , 
        sender: JSON.parse(myObjStr).sender , 
        groupname:JSON.parse(myObjStr).groupname ,
        status_read:false,      
        queueno:JSON.parse(myObjStr).queueno,
        counter_no:JSON.parse(myObjStr).countername,
        remain:JSON.parse(myObjStr).remain,
      
      });
        QueueMessage.save();
        console.log("doc id",QueueMessage.id );
         return QueueMessage.id ;   
    }); 
   // return QueueMessage

  });


    socket.on('clear',() => {  
    console.log("remove db..")
    Queue.remove({}, function(){
        // Emit cleared
         socket.emit('cleared');
          socket.broadcast.emit("received", { message: 'Deleted' });
    });
    });


    socket.on("remain_group_a", function(msg) {  
          data ={
           "group_name":"A",
           "remain": msg.remain,
           "status_trans":  "COMPLEATE"           
          } 
        socket.broadcast.emit("remain_group_a",data); 
    });

    
    socket.on("remain_group_b", function(msg) {  
      data ={
       "group_name":"B",
       "remain": msg.remain,
       "status_trans":  "COMPLEATE"           
      } 
    socket.broadcast.emit("remain_group_b",data); 
    });

    socket.on("remain_group_c", function(msg) {  
      data ={
       "group_name":"C",
       "remain": msg.remain,
       "status_trans":  "COMPLEATE"           
      } 
    socket.broadcast.emit("remain_group_c",data); 
    });

    socket.on("remain_group_d", function(msg) {  
      data ={
       "group_name":"D",
       "remain": msg.remain,
       "status_trans":  "COMPLEATE"           
      } 
    socket.broadcast.emit("remain_group_d",data); 
    });
 
    socket.on("remain_group_e", function(msg) {  
      data ={
       "group_name":"E",
       "remain": msg.remain,
       "status_trans":  "COMPLEATE"           
      } 
    socket.broadcast.emit("remain_group_e",data); 
    });

    socket.on("remain_group_f", function(msg) {  
      data ={
       "group_name":"F",
       "remain": msg.remain,
       "status_trans":  "COMPLEATE"           
      } 
    socket.broadcast.emit("remain_group_f",data); 
    });


    socket.on("MobileQ", function(msg) {  
      console.log("MobileQ")
     /*  data ={
       "group_name":"F",
       "remain": msg.remain,
       "status_trans":  "COMPLEATE"           
      }  */
    socket.broadcast.emit("MobileQ"); 
    });




    
 socket.on("remain_group", function(msg) {
  console.log("remain " + msg);  
  socket.broadcast.emit("remain", msg); 
    });

 socket.on("emit_oth", function(msg) {
  console.log("emit_oth " + msg);  
  socket.broadcast.emit("emit_oth",   msg  ); 
 });






  
});

http.listen(port, () => {
  console.log("Running on Port: " + port);
});
