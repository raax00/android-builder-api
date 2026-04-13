const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(express.json());

// Home test
app.get("/", (req, res) => {
  res.send("✅ Android Builder API Running");
});

// Create project
app.post("/create", (req, res) => {
  exec("gradle init --type java-application", (err, stdout) => {
    if (err) return res.send(err.toString());
    res.send(stdout);
  });
});

// Build APK (basic example)
app.post("/build", (req, res) => {
  exec("cd project && ./gradlew assembleDebug", (err, stdout, stderr) => {
    if (err) return res.send(stderr);
    res.send(stdout);
  });
});

app.listen(3000, () => console.log("Server running on 3000"));