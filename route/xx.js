//require the express module
const express = require("express");
const app = express();
const dateTime = require("simple-datetime-formater");
const bodyParser = require("body-parser");
const queueRouter = require("./route/queueRouter");
const loginRouter = require("./route/loginRoute");
const productRoutes = require("./route/products");
const orderRoutes = require("./route/orders");
//require the http module
const http = require("http").Server(app);

// require the socket.io module
const io = require("socket.io");

const port = 5000;

//bodyparser middleware
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");  
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS'); 
  next();
});



//routes
app.use("/queue", queueRouter);
app.use("/login", loginRouter);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
//set the express.static middleware
app.use(express.static(__dirname + "/public"));

//integrating socketio
socket = io(http);

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
    socket.broadcast.emit("received", { message: msg });

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
  });




  socket.on("Queue show", function(msg) {
    const myObjStr = JSON.stringify(msg);
    console.log("message: " +  JSON.parse(myObjStr).msg )
    socket.broadcast.emit("received", { message:  JSON.parse(myObjStr).msg  });   
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
    }); 


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
  console.log("message group a " + msg);  
  socket.broadcast.emit("remain_a", msg); 
    });

    socket.on("remain_group_b", function(msg) {
  console.log("message group b " + msg);  
  socket.broadcast.emit("remain_b",    msg  ); 
    });

    socket.on("remain_group_c", function(msg) {
  console.log("message group c " + msg);  
  socket.broadcast.emit("remain_c",     msg  ); 
    });

 socket.on("remain_group_d", function(msg) {
  console.log("message group d " + msg);  
  socket.broadcast.emit("remain_d",    msg  ); 
 });

 socket.on("remain_group_f", function(msg) {
  console.log("message group f " + msg);  
  socket.broadcast.emit("remain_f",    msg  ); 
 });

 socket.on("remain_group_f", function(msg) {
  console.log("message group f " + msg);  
  socket.broadcast.emit("remain_f",   msg  ); 
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
