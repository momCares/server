const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./assets/payments");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, Date.now() + "-" + fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else if (upload) {
      if (err instanceof multer.MulterError) {
        res.send(err); // Error response when uploading
      } else if (err) {
        return cb(err);
      }
    } else {
      cb(null, false);
      return cb(new Error("Only.png,.jpg and.jpeg format allowed!"));
    }
  },
});

module.exports = upload;
