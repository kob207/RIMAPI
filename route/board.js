const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const Board = require("../models/board");
const url = "http://localhost:5050";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
    // cb(null, path.join(__dirname, '../uploads/'))
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/", (req, res, next) => {
  Product.find()
    .select("name detail _id boardImage")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            detail: doc.detail,
            img: doc.boardImage,
            _id: doc._id,

            request: {
              type: "GET",
              url: url + "/board/" + doc._id,
            },
          };
        }),
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", upload.single("boardImage"), (req, res, next) => {
  console.log("posss");
  var io = req.app.get("socketio");
  let message = { group_name: "a", remain: "ทดสอบ" };

  const board = new Board({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    detail: req.body.detail,
    boardImage: req.file.path.replace("public\\", ""),
  });
  board
    .save()
    .then((result) => {
      // console.log(result);

      res.status(201).json({
        message: "Created board successfully",
        createdBoard: {
          name: result.name,
          detail: result.detail,
          _id: result._id,
          request: {
            type: "GET",
            url: url + "/board/" + result._id,
          },
        },
      });
      io.emit("board", message);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:boardId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name detail _id boardImage")
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: url + "/board",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:boardId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Board.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: url + "/board/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:boardId", (req, res, next) => {
  const id = req.params.boardId;
  Board.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Board deleted",
        request: {
          type: "POST",
          url: url + "/board",
          body: { name: "String", price: "Number" },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
