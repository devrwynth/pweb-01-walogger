const express = require('express');
const cors = require("cors");
const app = express();
const port = 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// Middleware
app.use(cors());
app.use(express.json()); // Untuk menangani request body JSON

// MongoDB Connection
const uri = "mongodb+srv://admin:walogger@walogger.wice1.mongodb.net/?retryWrites=true&w=majority&appName=WALogger";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let dbdata = []; // Data yang akan digunakan di endpoint
let coll; // Referensi ke koleksi database

async function loadInitialData() {
  const cursor = coll.find();
  dbdata = []; // Bersihkan data lama sebelum memuat ulang
  for await (const doc of cursor) {
    const stringdata = doc.data;
    dbdata.push(JSON.parse(stringdata));
  }
}

async function run() {
  try {
    await client.connect();
    const db = client.db("messages");
    coll = db.collection("jsons");

    // Muat data awal
    await loadInitialData();

    // Endpoint Status
    app.get('/status', (req, res) => {
      res.json({
        status: "Backend Jalan",
        uptime: process.uptime(),
      });
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
        // Simpan pesan baru ke database
        await coll.insertOne({ data: JSON.stringify(newMessage) });
        // Tambahkan ke cache (dbdata) agar real-time
        dbdata.push(newMessage);
        res.status(201).json({ message: "Pesan berhasil disimpan!" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal menyimpan pesan!" });
      }
    });

    // Jalankan server
    app.listen(port, () => {
      console.log(`Backend PWEB berjalan di http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Gagal menjalankan server:", err);
  }
}

run().catch(console.dir);
