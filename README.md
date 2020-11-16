# Study Saturday: Week 2
Express and Sequelize Review

## Objective: Build a fully-functioning CRUD API for 2 models, Students and Tests. Test specs are provided to guide development.

### Details

	- Necessary Models:
		- Student
		- Test

	- Necessary routes:

		- Get all students

		- Get all test scores

		- Update student name

		- Update test score

		- Get mean test score by student ID

		- Get top scoring student

		- Delete Student

		- Delete Score

		- Add Student

		- Add Score

### Instructions
	- Open 02_routes.test.js
	- Time to create the following routes in routes/students:
		- get ‘/’
		- get ‘/:id’
		- post ‘/’
		- put ‘/:id’
		- delete ‘/:id’

### How to test routes with specs
	- `npm t`
