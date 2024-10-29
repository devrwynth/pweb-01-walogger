const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const whatsappRoutes = require('./routes/whatsapp');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use('/api/whatsapp', whatsappRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

