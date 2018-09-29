const router = require('express').Router();
// first need to get database: 
const Student = require('../db/models/student')

// in app.js we mounted 'students', so we leave that off URI:

router.get('/', async (req, res, next) => {
    const students = await Student.findAll();
    res.send(students);
    next()
})

router.get('/:id', async (req, res, next) => {
    try {
        const studentId = req.params.id;
        const studentToReturn = await Student.findById(studentId)
        if (studentToReturn) {
            res.status(200).json(studentToReturn)
        }
        else {
            res.status(404).json('not found')
            // status just sends number, no headers so have to either send json or sendStatus
            //res.sendStatus(404)
        }
        
    } catch (err) {
        next(err)
    }
});

router.post('/', async (req, res, next) => {
    try {
    const newStudent = await Student.create(req.body)
    res.status(201).send(newStudent)
    } catch (err) {
        next(err)
    }
});

// updating an instance: 
router.put('/:id', async (req, res, next) => {
    const studentToUpdate = await Student.findById(req.params.id)
    const updatedStudent = await studentToUpdate.update(req.body)
    res.status(200).send(updatedStudent)
    // alternative - updating Model:
    // need to use destructuring and add 'returning true'
    // and send instances [0]
//     let [num, instances] = await Student.update(req.body, {where: {
//         id: req.params.id,
//     returning: true
//     }
// });
// res.status(200).json(instances[0])
});

// deleting an instance:
router.delete('/:id', async (req, res, next) => {
    const studentToDel = await Student.findById(req.params.id);
    const deleteStudent = await studentToDel.destroy(studentToDel)
    res.status(204).send(deleteStudent)
})

module.exports = router;
