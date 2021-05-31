const express = require("express");
const routes = require("express").Router();
const DB = require("./db");

routes.get("/filters", function (req, res) {
  DB.getFilters()
    .then((filters) => {
      // res.status(200).json(filters);
      res.send(filters);
    })
    .catch((err) => {
      console.log("Error getting filters: ", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

routes.get("/listAll", function (req, res) {
  DB.listAll(req.query)
    .then((finalResult) => {
      // res.status(200).json(finalResult);
      res.send(finalResult);
    })
    .catch((err) => {
      console.log("Error getting finalResult: ", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

module.exports = routes;
