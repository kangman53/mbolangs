const express = require('express')
const app = express()
const router = express.Router();
const Model = require('../models')
var QRCode = require('qrcode');

router.get('/', (req, res) => {
  res.redirect('/school/dashboard')
})

router.get('/dashboard', (req, res) => {
  res.render('pages/school/dashboard')
})

router.get('/student', (req, res) => {
  Model.School.findOne({
    include:{
      model: Model.Student
    },
    where: {
        id:1
    }
  })
    .then((school) => {
      let students = school.Students.map(s => {
        average = s.getAverage()
        return {s, average}
      });
      res.render('pages/school/student', {
        students: students
      })
    })

    .catch((err) => {
      res.send(err)
    })
})

router.get('/student/validate', (req, res) => {
  res.render('pages/school/student_validate', {
    msgErr: req.query.err || null
  })
})

router.get('/student/search', (req, res) => {
  let nisn = req.query.nisn
  if (!nisn) {
    res.redirect('/school/student/validate?err=NISN Empty')
  }
  Model.Student.findOne({
    where: {
      nisn: nisn
    }
  })
    .then((student) => {
      if (student) {
        res.render('pages/school/student_generate', {
          student: student,
          average: student.getAverage()
        })
      } else {
        res.redirect('/school/student/validate?err=NISN Not Found')
      }
    })

    .catch((err) => {
      res.send(err)
    })
})

router.get('/student/qrcode/:id', function (req, res) {
  let id = req.params.id
  let dataStudent = {}
  Model.Student.findOne({
    include: {
      model: Model.User
    },
    where: {
      id : id
    }
  })

  .then((student) => {
    dataStudent = student
    return QRCode.toDataURL(`localhost:3000/token?token=${student.User.password}`)
  })

  .then(url => {
    res.render('pages/school/qrcode', {
      qr: url,
      data: dataStudent
    });
  })

  .catch(err => {
    res.send(err)
  })
});

router.post('/student/validate', (req, res) => {
  let nisn = req.body.nisn
  res.redirect(`/school/student/search?nisn=${nisn}`)
})

router.post('/student/generate/:id', (req, res) => {
  let id = req.params.id
  let email = req.body.email
  Model.Student.update(
    {
      email: email
    }, {
      where: {
        id : id
      },
      individualHooks : true
    }
  )

    .then((data) => {
      res.redirect(`/school/student/qrcode/${id}`)
    })

    .catch((err) => {
      res.send(err)
    })
})

module.exports = router