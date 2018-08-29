'use strict';

const chai = require('chai');
const expect = chai.expect;
const Student = require('../db/models/student');
const Test = require('../db/models/test');
const db = require('../db/db');
const Promise = require('bluebird');

describe('Models', function() {
  before(function() {
    return db.sync({ force: true });
  });

  describe('The `Students` model', function() {
    //initial force sync to clear the db

    //create student BEFORE EACH test
    let student;
    let firstName = 'Peter';
    let lastName = 'Parker';
    let email = 'peterP@spidey.web';

    beforeEach(function() {
      student = Student.build({
        firstName,
        lastName,
        email,
      });
    });

    //remove student AFTER EACH test
    //cascade:true `Only used in conjunction with TRUNCATE. Truncates all tables that have foreign-key references to the named table, or to any tables added to the group due to CASCADE`.
    //src: http://docs.sequelizejs.com/class/lib/model.js~Model.html#static-method-truncate
    afterEach(function() {
      return Student.truncate({ cascade: true });
    });

    describe('attributes definition', () => {
      it('includes `firstName`, `lastName`, and `email` fields', () => {
        return student.save().then(savedStudent => {
          expect(savedStudent.firstName).to.equal('Peter');
          expect(savedStudent.lastName).to.equal('Parker');
          expect(savedStudent.email).to.equal('peterP@spidey.web');
        });
      });

      it('requires `firstName`', () => {
        student.firstName = null;
        return student.validate().then(
          () => {
            throw new Error('validation should fail when firstName is null');
          },
          createdError => expect(createdError).to.be.an.instanceOf(Error)
        );
      });

      it('requires `lastName`', () => {
        student.lastName = null;
        return student.validate().then(
          () => {
            throw new Error('validation should fail when lastName is null');
          },
          createdError => expect(createdError).to.be.an.instanceOf(Error)
        );
      });

      it('requires `email`', () => {
        student.email = null;
        return student.validate().then(
          () => {
            throw new Error('validation should fail when email is null');
          },
          createdError => expect(createdError).to.be.an.instanceOf(Error)
        );
      });

      it('requires `email` to be in an email form', () => {
        student.email = 'hola world';
        return student.validate().then(
          () => {
            throw new Error(
              'validation should fail when email is not in email form'
            );
          },
          createdError => {
            expect(createdError).to.be.an.instanceOf(Error);
            expect(createdError.message).to.contain('Validation error');
          }
        );
      });
      //end of `attributes definition` describe block
    });

    describe('a `pre` create hook', () => {
      let newStudent;
      beforeEach(() => {
        newStudent = Student.build({
          firstName: 'charles',
          lastName: 'xavier',
          email: 'charlie@brainy.com',
        });
      });

      it('capitalizes the first letter of the first and last name before save to the DB', () => {
        return newStudent.save().then(savedStudent => {
          expect(savedStudent.firstName).to.equal('Charles');
          expect(savedStudent.lastName).to.equal('Xavier');
        });
      });
    });
    //end of `options definition` describe block

    //end of `The Students model` describe block
  });
  describe('The `Test` model', function() {
    let test;
    let subject = 'Tree-climbing';
    let grade = 79;

    beforeEach(() => {
      test = Test.build({
        subject,
        grade,
      });
    });

    afterEach(() => {
      return Promise.all([
        Test.truncate({ cascade: true }),
        Student.truncate({ cascade: true }),
      ]);
    });

    describe('attributes definition', () => {
      it('includes `subject` and `grade` fields', () => {
        return test.save().then(savedTest => {
          expect(savedTest.subject).to.equal('Tree-climbing');
          expect(savedTest.grade).to.equal(79);
        });
      });

      it('requires `subject`', () => {
        test.subject = null;
        return test.validate().then(
          () => {
            throw new Error('validation should fail when subject is null');
          },
          createdError => expect(createdError).to.be.an.instanceOf(Error)
        );
      });

      it('requires `grade`', () => {
        test.grade = null;
        return test.validate().then(
          () => {
            throw new Error('validation should fail when grade is null');
          },
          createdError => expect(createdError).to.be.an.instanceOf(Error)
        );
      });
      //end of `attributes definition` describe block
    });

    describe('associations', () => {
      it('belongs to a student', () => {
        const newStudent = Student.create({
          firstName: 'Pepper',
          lastName: 'Potts',
          email: 'pp@salsa.com',
        });
        const newTest = Test.create({
          subject: 'sword-sharpening',
          grade: 100,
        });
        return Promise.all([newStudent, newTest])
          .spread((createdStudent, createdTest) => {
            return createdTest.setStudent(createdStudent);
          })
          .then(() => {
            return Test.findOne({
              where: { subject: 'sword-sharpening' },
              include: { model: Student, as: 'student' },
            });
          })
          .then(foundTest => {
            expect(foundTest).to.exist; //eslint-disable-line no-unused-expressions
            expect(foundTest.student.firstName).to.equal('Pepper');
          });
      });
    });
  });
});
