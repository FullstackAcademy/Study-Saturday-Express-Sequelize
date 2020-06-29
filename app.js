const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./db/db');
const students = require('./routes/students');
const tests = require('./routes/tests');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use('/students', students); // this already includes the /students, so we should not
app.use('/tests', tests); // specify /students in the actual students.js file.  Instead, we should just write /.

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// app.get('/', function (req, res, next) {
//   try {
//     res.redirect('/students/');
//   } catch (error) {
//     next(error);
//   }
// });


const init = async () => {

  if (require.main === module) {
    //will only run when run with npm start and not with npm test to avoid db syncing in multiple threads when running tests
    try {
      await db.sync();
      app.listen(3000, () => {
        console.log('Server is listening on port 3000!');
      })
    } catch (err) {
      console.error(err);
    }
  }

}

init();

module.exports = app;
