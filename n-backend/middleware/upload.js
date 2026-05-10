const multer = require("multer");

const path = require("path");

const fs = require("fs");

const crypto = require("crypto");

/* =========================
   UPLOAD DIRECTORY
========================= */

const uploadDir = path.join(
  __dirname,
  "../uploads"
);

/* =========================
   CREATE UPLOADS FOLDER
========================= */

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
      recursive: true,
    });

    console.log(
      "✅ Upload folder created"
    );
  }
} catch (error) {
  console.error(
    "❌ Failed to create uploads folder:",
    error.message
  );
}

/* =========================
   STORAGE CONFIG
========================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    try {
      const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
      ];

      let ext = path
        .extname(file.originalname)
        .toLowerCase();

      if (
        !allowedExtensions.includes(ext)
      ) {
        ext = ".jpg";
      }

      const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;

      cb(null, uniqueName);
    } catch (error) {
      cb(error);
    }
  },
});

/* =========================
   FILE FILTER
========================= */

const fileFilter = (
  req,
  file,
  cb
) => {
  try {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
    ];

    const ext = path
      .extname(file.originalname)
      .toLowerCase();

    const isMimeValid =
      allowedMimeTypes.includes(
        file.mimetype
      );

    const isExtValid =
      allowedExtensions.includes(ext);

    if (
      isMimeValid &&
      isExtValid
    ) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only JPG, JPEG, PNG, and WEBP images are allowed"
      ),
      false
    );
  } catch (error) {
    return cb(error, false);
  }
};

/* =========================
   MULTER INSTANCE
========================= */

const upload = multer({
  storage,

  fileFilter,

  limits: {
    // 5MB
    fileSize: 5 * 1024 * 1024,
  },
});

/* =========================
   EXPORTS
========================= */

module.exports = upload;