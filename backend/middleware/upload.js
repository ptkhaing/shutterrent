const multer = require("multer");
const path = require("path");

// Local disk storage. Note: on serverless hosts (e.g. Vercel) the filesystem
// is ephemeral, so uploaded files may not persist across redeploys/instances.
// Fine for local dev and most traditional hosts (Render, a VPS, etc).
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;