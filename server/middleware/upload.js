const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

// URI dari `db.js` untuk menjaga konsistensi
const uri = "mongodb+srv://admin:walogger@walogger.wice1.mongodb.net/messages?retryWrites=true&w=majority&appName=WALogger";

// Konfigurasi GridFsStorage
const storage = new GridFsStorage({
    url: uri,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"]; // Format file yang diizinkan

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-${file.originalname}`;
            return filename; // Nama file jika format tidak sesuai
        }

        return {
            bucketName: "photos", // Nama bucket (default: photos)
            filename: `${Date.now()}-${file.originalname}`,
        };
    },
});

// Ekspor konfigurasi upload
module.exports = multer({ storage });