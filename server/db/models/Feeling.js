const Sequelize = require('sequelize');
const db = require('../database');
const { ENUM } = Sequelize;
const Feeling = db.define('feeling', {
  name: {
    type: ENUM,
    values: ['stressed', 'distracted', 'lonely', 'other'],
  },
  defaultValue: 'stressed',
  allowNull: false,
});

module.exports = Feeling;
