import * as config from "config";
let mongoose = require("mongoose");

mongoose.Promise = Promise;

// create connection with mongoDB
const db = mongoose.createConnection(String(config.get("mongodb")), {
  useNewUrlParser: true,
});

// error callback, to catch error
db.on("error", console.error.bind(console, "connection to DB error: "));
db.once("open", function () {
  console.log("[Server]", "Connection with MongoDB installed");
});

export default db;
