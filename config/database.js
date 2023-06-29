const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const url = process.env.DB_URL;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const con = mongoose.connection;

con.on('open', () => {
  console.log('Database connected');
});
