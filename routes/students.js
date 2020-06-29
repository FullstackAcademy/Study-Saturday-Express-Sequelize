const Student = require('../db/models/student');

const router = require('express').Router();


/* /students/ is implicitly included through app.js, app.use. */
router.get('/', async (req, res, next) => {
  try {
    let val = Student.findAll(); // so it's a JSON object by default?
    console.log(val);
    res.status(200).send(val);
  } catch (error) {
    next(error);
  }
})





module.exports = router;
