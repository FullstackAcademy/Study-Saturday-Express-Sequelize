'use strict';
const Sequelize = require('sequelize');
const db = require('../db');
const Student = require('./student');

const Test = db.define('test', {
    subject: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    grade: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

Test.belongsTo(Student)

module.exports = Test;
