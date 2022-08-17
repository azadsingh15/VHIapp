//mongodb
require("./config/db");

const app = require("express")();
const express = require("express");
const port = 3000;
//Password:HVm0EPUXGY0ua9WF
//Password:n0v0ouQTCF3t14Ql
const UserRouter = require("./routes/user");

//For accepting post form data
const bodyParser = require("express").json;
app.use(bodyParser());

app.use("/user", UserRouter);
app.use(express.static("data/pdfuploads"));

app.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to Backend!" });
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
