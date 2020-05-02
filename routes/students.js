// require the router 
const router = require('express').Router();
const Student = require('../db/models/student');

// setup routes
router.get('/', async(req, res, next) => {
    try {
        const students = await Student.findAll();
        res.send(students);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async(req, res, next) => {
    try {
        let student = await Student.findById(req.params.id);
        if (student) {
            res.send(student);
        } else {
            res.status(404).send('Student not found');
        }
    } catch (error) {
        next(error);
    }
});

router.post('/', async(req, res, next) => {
    try {
        let student = await Student.create(req.body);
        res.status(201).send(student);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async(req, res, next) => {
    let updatedStudent = req.params.id;
    try {
        let updatedStudentInfo = await Student.update(req.body, {
            where: { id: updatedStudent },
            returning: true,
            plain: true,
        });
        res.send(updatedStudentInfo[1]);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async(req, res, next) => {
    let deletedStudent = req.params.id;
    try {
        await Student.destroy({ where: { id: deletedStudent } });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

// export the router
module.exports = router;