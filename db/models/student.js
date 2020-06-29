'use strict';

const Sequelize = require('sequelize');
const db = require('../db');

const Student = db.define('Student', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    },
    allowNull: false,
  },
}, {
  hooks: {
    beforeCreate: (student, options) => {
      student.firstName = student.firstName.charAt(0).toUpperCase() + student.firstName.slice(1);
      student.lastName = student.lastName.charAt(0).toUpperCase() + student.lastName.slice(1);
    }
  }
});



module.exports = Student;
