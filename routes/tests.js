const router = require('express').Router();
const Test = require('../db/models/test');
const Student = require('../db/models/student');

// setup routes
router.get('/', async(req, res, next) => {
    try {
        const tests = await Test.findAll();
        res.send(tests);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async(req, res, next) => {
    let testId = req.params.id
    try {
        let selectedTest = await Test.findById(testId);
        if (selectedTest) {
            res.send(selectedTest);

            // run this if not a json object
            res.json(selectedTest);
        } else {
            res.status(404).send('Test not found');
        }
    } catch (error) {
        next(error);
    }
});

router.post('/student/:studentId', async(req, res, next) => {
    let studentId = req.params.studentId;

    // a post has a req.body - see the test
    console.log(req.body, "REQ.BODY")

    try {
        // figure out the student row
        let student = await Student.findById(studentId)
            // create a new row to link these together
        let newTest = await Test.create(req.body);

        // take new test we made 
        let studentTest = await newTest.setStudent(student);

        res.status(201).send(studentTest);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async(req, res, next) => {
    let deletedTest = req.params.id;
    try {
        await Test.destroy({ where: { id: deletedTest } });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

// export the router
module.exports = router;