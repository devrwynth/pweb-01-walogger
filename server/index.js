const express = require('express');
const cors = require("cors");
const { MongoClient, GridFSBucket } = require('mongodb');
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: 'uploads/' });  // Untuk menyimpan file sementara
const app = express();
const port = 3000;

// MongoDB Connection
const uri = "mongodb+srv://admin:walogger@walogger.wice1.mongodb.net/?retryWrites=true&w=majority&appName=WALogger";
const client = new MongoClient(uri, {
    serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
    }
});

let gfs;
let db;
let coll; // For collections

// Fungsi untuk mengambil nama dari phonebook
async function getContactName(phoneNumber) {
    try {
        const contact = await client.db("messages").collection("phonebook").findOne({ phone: phoneNumber });
        return contact ? contact.name : phoneNumber; // Jika tidak ada nama, tampilkan nomor telepon
    } catch (error) {
        console.error("Gagal mengambil nama kontak:", error);
        return phoneNumber; // Jika error, tampilkan nomor telepon
    }
}

// Fungsi untuk memuat data awal dari MongoDB
async function loadInitialData() {
    const cursor = coll.find();
    dbdata = []; // Bersihkan data lama sebelum memuat ulang
    for await (const doc of cursor) {
        const stringdata = doc.data;
        dbdata.push(JSON.parse(stringdata)); // Parse data menjadi objek
    }
}

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        const db = client.db("messages");
        coll = db.collection("jsons");

        // Muat data awal
        await loadInitialData();

        const bucket = new GridFSBucket(db, {
            bucketName: 'photos'  // Bucket name for storing images
        });

        // Set up GridFS for file storage
        gfs = bucket;

        // Middleware for JSON handling and CORS
        app.use(cors());
        app.use(express.json());

        // ===================================
        // Endpoint Status
        app.get('/status', (req, res) => {
            res.json({
                status: "Backend Jalan",
                uptime: process.uptime(),
            });
        });

        // Endpoint untuk mendapatkan nama kontak berdasarkan nomor telepon
        app.get('/contact/:phoneNumber', async (req, res) => {
            const phoneNumber = req.params.phoneNumber;
            try {
                const contactName = await getContactName(phoneNumber);
                res.json({
                    phoneNumber,
                    name: contactName,
                });
            } catch (error) {
                res.status(500).json({ error: "Gagal mengambil nama kontak." });
            }
        });

        // Endpoint untuk mendapatkan semua kontak
        app.get('/contacts', async (req, res) => {
            try {
                const phonebookCursor = await client.db("messages").collection("phonebook").find();
                const phonebook = await phonebookCursor.toArray();

                res.json({
                    data: phonebook,
                });
            } catch (error) {
                console.error("Error fetching contacts:", error);
                res.status(500).json({ error: "Failed to fetch contacts" });
            }
        });

        // Endpoint untuk mendapatkan semua chat
        app.get('/chat', (req, res) => {
            res.json({
                data: dbdata,
            });
        });

        // Endpoint untuk mendapatkan chat berdasarkan ID
        app.get('/chat/:id', (req, res) => {
            const id = req.params.id;
            const response = dbdata.find(d => d._data.id._serialized === id);

            if (!response) {
                res.status(404).json({
                    error: "Data tidak ditemukan!",
                });
            } else {
                res.status(200).json({
                    data: response,
                });
            }
        });

        // Endpoint untuk menambahkan pesan baru
        app.post('/chat', async (req, res) => {
            const newMessage = req.body;

            if (!newMessage || !newMessage._data) {
                return res.status(400).json({ error: "Pesan tidak valid!" });
            }

            try {
                // Simpan pesan baru ke database dengan menyimpan objek JSON
                await coll.insertOne({ data: JSON.stringify(newMessage) });
                // Tambahkan ke cache (dbdata) agar real-time
                dbdata.push(newMessage);
                res.status(201).json({ message: "Pesan berhasil disimpan!" });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Gagal menyimpan pesan!" });
            }
        });

        // ===================================
        // File Upload and Download Routes
        app.use("/file", upload.single('file'));  // For single file upload

        // Upload file (Image, etc.)
        app.post("/file", (req, res) => {
            const file = req.file;
            if (!file) {
                return res.status(400).send("No file uploaded.");
            }

            const uploadStream = gfs.openUploadStream(file.originalname);
            const fileStream = fs.createReadStream(file.path);

            fileStream.pipe(uploadStream);

            uploadStream.on('finish', () => {
                res.status(201).send({ message: "File uploaded successfully", filename: file.originalname });
            });

            uploadStream.on('error', (err) => {
                res.status(500).send({ error: "Error uploading file", details: err });
            });
        });

        // Download file (Image, etc.)
        app.get("/file/:filename", (req, res) => {
            const filename = req.params.filename;
            const downloadStream = gfs.openDownloadStreamByName(filename);

            downloadStream.on('data', (chunk) => {
                res.write(chunk);
            });

            downloadStream.on('end', () => {
                res.end();
            });

            downloadStream.on('error', () => {
                res.status(404).send("File not found");
            });
        });

        // Delete file from GridFS
        app.delete('/file/:filename', async (req, res) => {
            const filename = req.params.filename;
            try {
                const file = await gfs.find({ filename }).toArray();
                if (file.length > 0) {
                    await gfs.delete(file[0]._id);
                    res.send("File deleted successfully");
                } else {
                    res.status(404).send("File not found");
                }
            } catch (error) {
                console.error(error);
                res.status(500).send("An error occurred.");
            }
        });

        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    } catch (err) {
        console.error("Failed to run the server:", err);
    }
}

run().catch(console.dir);