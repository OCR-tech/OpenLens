// server.js
const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5500;

app.use(cors());
app.use(express.static("uploads"));

mongoose.connect("mongodb://localhost:27017/objectdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const MetadataSchema = new mongoose.Schema({
  timestamp: String,
  objectNumber: String,
  objectName: String,
  numberOfObject: String,
  frameFilename: String,
  videoPath: String,
  metadataPath: String,
});
const Metadata = mongoose.model("Metadata", MetadataSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage: storage });

app.post(
  "/api/upload",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "metadata", maxCount: 1 },
  ]),
  async (req, res) => {
    const meta = JSON.parse(
      fs.readFileSync(req.files["metadata"][0].path, "utf8")
    );
    const doc = new Metadata({
      ...meta,
      videoPath: req.files["video"][0].filename,
      metadataPath: req.files["metadata"][0].filename,
    });
    await doc.save();
    res.json({ id: doc._id });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
