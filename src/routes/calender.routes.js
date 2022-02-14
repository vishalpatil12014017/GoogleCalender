module.exports = (app) => {
  const calender = require("../controllers/calender.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  // http://localhost:3535/api/calender
  router.post("/", calender.create);

  // Retrieve all calender
  //http://localhost:3535/api/calender
  router.get("/", calender.findAll);

  // Retrieve all published calender
  //http://localhost:3535/api/calender/fromdb
  router.get("/fromdb", calender.findAllfromdb);

  // Delete a Tutorial with id
  //http://localhost:3535/api/calender/
  router.delete("/:id", calender.delete);

  app.use("/api/calender", router);
  
};
