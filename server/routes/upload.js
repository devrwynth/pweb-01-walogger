const upload = require("../middleware/upload");
const express = require("express");
const router = express.Router();

// Endpoint upload file
router.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("Anda harus memilih file untuk diunggah.");
    }
    const imgUrl = `http://localhost:3000/file/${req.file.filename}`;
    return res.status(201).json({ message: "File berhasil diunggah!", url: imgUrl });
});

module.exports = router;
