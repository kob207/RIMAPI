const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Component = require("../models/component");

// Handle incoming GET requests to /orders
router.get("/", (req, res, next) => {
  Order.find()
    .select("component quantity _id")
    .populate('component', 'name')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            component: doc.component,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:5050/orders/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  Component.findById(req.body.componentId)
    .then(component => {
      if (!component) {
        return res.status(404).json({
          message: "component not found"
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        component: req.body.componentId
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          component: result.component,
          quantity: result.quantity
        },
        request: {
          type: "GET",
          url: "http://localhost:5050/orders/" + result._id
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

router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate('component')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:5050/orders"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:orderId", (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "http://localhost:5050/orders",
          body: { componentId: "ID", quantity: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
