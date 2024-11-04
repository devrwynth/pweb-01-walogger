const express = require('express');
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:walogger@walogger.wice1.mongodb.net/?retryWrites=true&w=majority&appName=WALogger";
var dataString = "";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

var dbdata = [];
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // data disimpan pada database "messages" pada collection "jsons"
    const db = client.db("messages");
    const coll = db.collection("jsons");
    const cursor = coll.find();
    for await (const doc of cursor) {
        var stringdata = doc.data;
        dbdata.push(JSON.parse(stringdata));
    }
    //console.log(dbdata);
    // isi data harusnya sama dengan yang ada di file index.js sebelum ini tipenya
    const data = dbdata;
    app.get('/status', (req, res) => {
        res.json({
            status: "Backend Jalan",
            uptime: process.uptime()
        });
    });
    
    app.get('/chat', (req, res) => {
        // res.json(data.map((user) => user.name));
        res.json({
            data
        });
    });
    
    app.get('/chat/:id', (req, res) => {
        const id = req.params.id;
        const response = data.find(d => d._data.id._serialized === id);
    
        if (!response) {
            res.status(404).json({
                error: "Gaada datanya wakk"
            });
        } else {
            res.status(200).json({
                data: response
            });
        }
    });
    
    app.listen(port, () => {
        console.log(`Backend PWEB pake express di http://localhost:${port}`);
    });
    
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



