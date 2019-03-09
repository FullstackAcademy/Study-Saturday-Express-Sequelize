const router = require('express').Router();
const Student = require('../db/models/student')
const Test = require('../db/models/test')
    // router.use(bodyParser.json());



router.get('/', async(req, res) => {
    const students = await Student.findAll({
        attributes: ['firstName']
    })
    res.send(students)
})

router.get('/:id', async(req, res, next) => {
    try {
        const student = await Student.findById(req.params.id)
        console.log('------------- get', student)
        if (student) {
            res.send(student)
        } else { res.status(404).send('Sorry, this page is not valid') }

    } catch (error) {
        next(error)
    }
})

router.post('/', async(req, res, next) => {
    try {
        const newStudent = await Student.create(req.body)
        res.status(201).send(newStudent)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async(req, res, next) => {
    try {
        //best practice to always send req.body instead of specifying what to update
        const update = await Student.update((req.body), {
            where: {
                id: req.params.id
            },
            returning: true,
            //required for .update 
            plain: true
                //required for .update
        })
        console.log('++++++++++++update', update)
        res.status(201).send(update[1])
            //use update[1] since update creates an array and the first element is # of rows updated. The object lives at update[1]
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async(req, res, next) => {
    try {
        const destroy = await Student.destroy({
            where: {
                id: req.params.id
            },
        })
        console.log('-------------destroy', destroy)
            //destroy will return a number, so we send back req.body
        res.status(204).send(req.body)
    } catch (error) {
        next(error)
    }
})

router.use((req, res) => {
    res.status(404).send('Sorry, this page is not valid')
})

module.exports = router;