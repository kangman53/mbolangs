const router = require('express').Router();
const Model = require('../models')

router.get('/', (req, res) => {
  res.redirect('/student/dashboard')
})

router.get('/dashboard', (req, res) => {
  res.render('pages/student/dashboard')
})

router.get('/register', (req, res) => {
  let dataStudent = {}
  Model.Student.findOne({
    where: {
      id: req.session.user.id,
    }
  })
    .then((student) => {
      dataStudent = student
      dataStudent.average = student.getAverage()
      // res.send(student)
      return Model.School.getSchool(dataStudent.average)
      })

    .then((schools) => {
      res.render('pages/student/register', {
        student: dataStudent,
        schools: schools,
        msgErr: req.query.err || null
      })
    })

    .catch((err) => {
      res.send(err)
    })
})

router.post('/register', (req, res) => {
  let studentId = req.session.user.id
  let first = req.body.first
  let second = req.body.second
  let third = req.body.third
  let count = 1;
  let newPromise = [];

  if (!first && !second && !third) {
    res.redirect('/student/register?err=Harus pilih sekolah')
  } else {
    if (first) {
      Model.Register.create({
        studentId: studentId,
        schoolId: first,
        chooseOrder: count
      })

      count++
    }

    if (second) {
      Model.Register.create({
        studentId: studentId,
        schoolId: second,
        chooseOrder: count
      })
      count++
    }

    if (third) {
      Model.Register.create({
        studentId: studentId,
        schoolId: third,
        chooseOrder: count
      })
      count++
    }


  }

})

module.exports = router;