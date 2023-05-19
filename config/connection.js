const mongoose = require('mongoose');

const connectionString ='mongodb://localhost:27017/socialNetworkDB';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose.connection;
