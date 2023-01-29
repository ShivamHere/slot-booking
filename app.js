require("dotenv").config({ path: ".env" });

const path = require("path");
global.appRoot = path.resolve(__dirname);
var bodyParser = require("body-parser");
var express = require("express");

global._pathconst = require("./api/helpers/pathconst.js");
var ResHelper = require(_pathconst.FilesPath.ResHelper);

//Express
var app = express();

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" })); //handle queryStrings
app.use(bodyParser.json({ limit: "50mb" }));

app.use(function (req, res, next) {
  // Mentioning content types
  res.setHeader("Content-Type", "application/json; charset=UTF-8");
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Accept,Authorization"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Pass to next layer of middleware
  next();
});

app.use("/v1", require(_pathconst.FilesPath.Routes));

app.use((err, req, res, next) => {
    ResHelper.apiResponse(res, false, "Error Occured.", 500, err, "");
});

module.exports = app;