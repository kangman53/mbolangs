const router = require('express').Router()
const Model = require('../models')
var QRCode = require('qrcode');


router.get('/', (req, res) => {
  res.redirect('/admin/dashboard')
})

router.get('/dashboard', (req, res) => {
  let promises = [Model.User.findAll(), Model.School.findAll()]
  Promise.all(promises)
    .then((dataAll) => {
      res.render('pages/admin/dashboard', {
        users: dataAll[0].length,
        schools: dataAll[1].length
      })
    })
})

router.get('/school', (req, res) => {
  Model.School.findAll()
    .then((schools) => {
      res.render('pages/admin/school', {
        schools: schools
      })
    })

    .catch((err) => {
      res.send(err)
    })
})

router.get('/school/add', (req, res) => {
  res.render('pages/admin/addschool', {
    action: 'add',
    school: {}
  })
})

router.get('/school/edit/:id', (req, res) => {
  let id = req.params.id
  Model.School.findOne({
    where: {
      id: id
    }
  })
    .then((school) => {
      res.render('pages/admin/addschool', {
        action: 'edit',
        school: school
      })
    })

    .catch((err) => {
      res.send (err)
    })
})

router.get('/school/qrcode/:id', function (req, res) {
  let id = req.params.id
  let dataSchool = {}
  Model.School.findOne({
    include: {
      model: Model.User
    },
    where: {
      id : id
    }
  })

  .then((school) => {
    dataSchool = school
    return QRCode.toDataURL(`localhost:3000/token?token=${school.User.password}`)
  })

  .then(url => {
    res.render('pages/admin/qrcode', {
      qr: url,
      data: dataSchool
    });
  })

  .catch(err => {
    console.error(err)
  })
});

router.post('/school/add', (req, res) => {
  let newSchool = {
    npsn: req.body.npsn,
    name: req.body.name,
    address: req.body.address,
    minGrade: req.body.minGrade,
    email: req.body.email,
    userId: null
  }

  Model.School.create(newSchool)
    .then((school) => {
      res.send(school)
    })

    .catch((err) => {
      res.send(err)
    })

})

router.post('/school/edit/:id', (req, res) => {
  let id = req.params.id
  let newSchool = {
    npsn: req.body.npsn,
    name: req.body.name,
    address: req.body.address,
    minGrade: req.body.minGrade,
    email: req.body.email,
  }

  Model.School.update(newSchool, {
    where: {
      id:id
    }
  })
    .then((school) => {
      res.send(school)
    })

    .catch((err) => {
      res.send(err)
    })

})

router.get('/school/delete/:id', (req,res) => {
  let id = req.params.id
  Model.School.destroy({
    where: {
      id : id
    }, individualHooks: true
  })
})

router.get('/student', (req, res) => {
  Model.Student.findAll()
    .then((students) => {
      res.render('pages/admin/student', {
        students: students
      })
    })

    .catch((err) => {
      res.send(err)
    })
})

router.get('/student/add', (req, res) => {
  res.render('pages/admin/addstudent', {
    action: 'add',
    student: {}
  })
})

router.get('/student/edit/:id', (req, res) => {
  let id = req.params.id
  Model.Student.findOne({
    where: {
      id: id
    }
  })
    .then((student) => {
      res.render('pages/admin/addstudent', {
        action: 'edit',
        student: student
      })
    })

    .catch((err) => {
      res.send (err)
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
    return QRCode.toDataURL(`localhost:3000/student/generate?token=${student.User.password}`)
  })

  .then(url => {
    res.render('pages/admin/qrcode', {
      qr: url,
      data: dataStudent
    });
  })

  .catch(err => {
    console.error(err)
  })
});

router.post('/student/add', (req, res) => {
  let newStudent = {
    nisn: req.body.nisn,
    name: req.body.name,
    email: req.body.email,
    placeOfBirth: req.body.placeOfBirth,
    dateOfBirth: req.body.dateOfBirth,
    address: req.body.address,
    indonesian: req.body.indonesian,
    mathematics: req.body.mathematics,
    english: req.body.english,
    sains: req.body.sains,
    userId: null
  }

  Model.Student.create(newStudent)
    .then((student) => {
      res.send(newStudent)
    })

    .catch((err) => {
      res.send(err)
    })

})

router.post('/student/edit/:id', (req, res) => {
  let id = req.params.id
  let newStudent = {
    nisn: req.body.nisn,
    name: req.body.name,
    email: req.body.email,
    placeOfBirth: req.body.placeOfBirth,
    dateOfBirth: req.body.dateOfBirth,
    address: req.body.address,
    indonesian: req.body.indonesian,
    mathematics: req.body.mathematics,
    english: req.body.english,
    sains: req.body.sains,
  }

  Model.Student.update(newStudent, {
    where: {
      id:id
    }
  })
    .then((student) => {
      res.send(student)
    })

    .catch((err) => {
      res.send(err)
    })

})

module.exports = router