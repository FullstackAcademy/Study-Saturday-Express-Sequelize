const router = require('express').Router();
// get data:
const Test = require('../db/models/test')
const Student = require('../db/models/student')

router.get('/', async (req, res, next) => {
    const tests = await Test.findAll()
    res.send(tests)
});

router.get('/:id', async (req, res, next) => {
    const test = await Test.findById(req.params.id);
    res.send(test)
})

router.post('/student/:id', async (req, res, next) => {
    const student = await Student.findById(req.params.id);
    // create new test instance and then set a new association method:
    const testInstance = await Test.create(req.body)
    const updatedTest = await testInstance.setStudent(student)
    res.status(201).json(updatedTest)
})

router.delete('/:id', async (req, res, next) => {
    const testToDel = await Test.findById(req.params.id);
    await testToDel.destroy();
    res.status(204).send(testToDel)
})

module.exports = router;
