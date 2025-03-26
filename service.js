const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Enable JSON & CORS (so the frontend can communicate)
app.use(express.json());
app.use(cors());

// File path where content is stored
const FILE_PATH = "content.html";

// Serve the saved content
app.get("/get-content", (req, res) => {
    fs.readFile(FILE_PATH, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading file");
        }
        res.send(data);
    });
});

// Save new content
app.post("/save-content", (req, res) => {
    const newContent = req.body.content;
    fs.writeFile(FILE_PATH, newContent, "utf8", (err) => {
        if (err) {
            return res.status(500).send("Error saving file");
        }
        res.send("Content saved successfully");
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
