const expect = require('chai').expect;
const request = require('supertest');

const app = require('../app');
const agent = request.agent(app);

const db = require('../db/db');
const Student = require('../db/models/student');
const Test = require('../db/models/test');

describe('Routes', () => {
  before(() => {
    return db.sync({ force: true });
  });

  afterEach(() => {
    return Promise.all([
      Student.truncate({ cascade: true }),
      Test.truncate({ cascade: true }),
    ]);
  });

  describe('Student Routes', () => {
    let pepper;
    let peter;
    let charlie;

    beforeEach(async () => {
      const studentData = [
        {
          firstName: 'Pepper',
          lastName: 'Potts',
          email: 'saltn@pepper.com',
        },
        {
          firstName: 'Peter',
          lastName: 'Parker',
          email: 'spidey@email.com',
        },
        {
          firstName: 'Charlie',
          lastName: 'Brown',
          email: 'cb@cbdb.com',
        },
      ];
      const createdStudents = await Promise.all(
        studentData.map((data) => Student.create(data))
      );
      pepper = createdStudents[0];
      peter = createdStudents[1];
      charlie = createdStudents[2];
    });

    describe('GET /students', () => {
      it('retrieves all the students', () => {
        return agent
          .get('/students')
          .expect('Content-Type', /json/)
          .expect(200)
          .expect((res) => {
            expect(res.body).to.be.an.instanceOf(Array);
            expect(res.body).to.have.length(3);
          });
      });
    });

    describe('GET /students/:id', () => {
      it('retrieves a single student by their id', () => {
        return agent
          .get(`/students/${pepper.id}`)
          .expect(200)
          .expect((res) => {
            if (typeof res.body === 'string') res.body = JSON.parse(res.body);
            expect(res.body.firstName).to.equal('Pepper');
          });
      });

      it('returns a 404 error if student does not exist in DB', () => {
        return agent.get('/students/09432').expect(404);
      });
    });

    describe('POST /students', () => {
      it('creates a new Student instance', () => {
        return agent
          .post('/students')
          .send({
            firstName: 'SQL',
            lastName: 'PRK',
            email: 'sqlprk@db.com',
          })
          .expect(201)
          .expect('Content-Type', /json/)
          .expect((res) => {
            expect(res.body.firstName).to.equal('SQL');
          });
      });
    });

    describe('PUT /students/:id', () => {
      it('updates an instance of a student', () => {
        return agent
          .put(`/students/${pepper.id}`)
          .send({ firstName: 'Salty' })
          .expect(200)
          .expect('Content-Type', /json/)
          .expect((res) => {
            expect(res.body.firstName).to.equal('Salty');
          });
      });
    });

    describe('DELETE /students/:id', () => {
      it('deletes an instance of a student', async () => {
        await agent.delete(`/students/${charlie.id}`).expect(204);
        const deletedStudent = await Student.findByPk(charlie.id);
        expect(deletedStudent).to.equal(null);
      });
    });
  });

  describe('Test Routes', () => {
    let funTest;
    let badTest;
    let hardTest;
    let crayTest;
    beforeEach(async () => {
      const testData = [
        {
          subject: 'Tree-Climbing',
          grade: 81,
        },
        {
          subject: 'Outdoor Wilderness Survival',
          grade: 43,
        },
        {
          subject: 'Wind-Surfing',
          grade: 85,
        },
        {
          subject: 'Outdoor Wilderness Survival',
          grade: 66,
        },
      ];
      const createdTests = await Promise.all(
        testData.map((data) => Test.create(data))
      );
      funTest = createdTests[0];
      badTest = createdTests[1];
      hardTest = createdTests[2];
      crayTest = createdTests[3];
    });
    afterEach(() => {
      return Promise.all([
        Student.truncate({ cascade: true }),
        Test.truncate({ cascade: true }),
      ]);
    });

    describe('GET /tests', () => {
      it('retrieves all tests', () => {
        return agent
          .get('/tests')
          .expect(200)
          .expect((res) => {
            expect(res.body).to.be.an.instanceOf(Array);
            expect(res.body).to.have.length(4);
          });
      });
    });

    describe('GET /tests/:id', () => {
      it('gets the test instance by id', () => {
        return agent
          .get(`/tests/${funTest.id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.subject).to.equal(funTest.subject);
          });
      });
    });

    describe('POST /tests/student/:studentId', () => {
      let student;
      beforeEach(async () => {
        student = await Student.create({
          firstName: 'Pepper',
          lastName: 'Potts',
          email: 'saltn@pepper.com',
        });
      });
      it('creates a new Test instance for a student', () => {
        return agent
          .post(`/tests/student/${student.id}`)
          .send({
            subject: 'Outdoor Wilderness Survival',
            grade: 43,
          })
          .expect(201)
          .expect('Content-Type', /json/)
          .expect((res) => {
            expect(res.body.studentId).to.equal(student.id);
          });
      });
    });
    describe('DELETE /tests/:id', () => {
      it('deletes an instance of test by its id', () => {
        return agent
          .delete(`/tests/${crayTest.id}`)
          .expect(204)
          .expect(async () => {
            const deletedTest = await Test.findByPk(crayTest.id);
            expect(deletedTest).to.equal(null);
          });
      });
    });
  });
});
