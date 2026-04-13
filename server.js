const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Project directory set karna
const PROJECT_DIR = path.join(__dirname, "project");

app.get("/", (req, res) => {
  res.send("✅ Android Builder API Running");
});

// Create project
app.post("/create", (req, res) => {
  // Pehle check karein agar folder nahi hai toh banayein
  if (!fs.existsSync(PROJECT_DIR)) {
    fs.mkdirSync(PROJECT_DIR);
  }
  
  exec("gradle init --type java-application", { cwd: PROJECT_DIR }, (err, stdout, stderr) => {
    if (err) return res.status(500).send(err.toString());
    res.send("Project Created Successfully: " + stdout);
  });
});

// Build Project (Code receive karke build karna)
app.post("/build", (req, res) => {
  const userCode = req.body.code;

  if (!userCode) {
    return res.status(400).send("❌ No code provided in request body.");
  }

  // Gradle init default path for java app is usually:
  // app/src/main/java/com/example/App.java (depends on package name)
  const codeFilePath = path.join(PROJECT_DIR, "app", "src", "main", "java", "org", "example", "App.java");

  try {
    // 1. User ka code file me save karein
    fs.mkdirSync(path.dirname(codeFilePath), { recursive: true });
    fs.writeFileSync(codeFilePath, userCode);

    // 2. Build run karein
    // Note: 'assembleDebug' Android apps ke liye hota hai. 
    // Basic java-application ke liye 'build' command use hoti hai.
    exec("./gradlew build", { cwd: PROJECT_DIR }, (err, stdout, stderr) => {
      if (err) {
        return res.status(500).send(`Build Failed:\n${stderr}`);
      }
      res.send(`✅ Build Successful!\n\n${stdout}`);
    });
  } catch (error) {
    res.status(500).send("Error saving code: " + error.message);
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
