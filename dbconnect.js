const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const url = "mongodb://dev:mflv[1234@127.0.0.1:27017/mmm";

const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

module.exports = connect;
