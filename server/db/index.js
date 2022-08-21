// this is the access point for all things database related!

const db = require('./database');

const User = require('./models/User');

// associations go here-  other uses for db (express routes) should be using the models from here after they're associated.

module.exports = {
  db,
  models: {
    User,
  },
};
