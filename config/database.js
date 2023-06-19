const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/ITLABDB';

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const con = mongoose.connection;

con.on('open', () => {
  console.log('Database connected');
});
