const router = require('express').Router()
const Model = require('../models')
const crypto = require('crypto');

router.get('/', (req, res) => {
  res.render('pages/root/index')
})

router.get('/token', (req, res) => {
  let token = req.query.token
  Model.User.findOne({
    include: [
      {model: Model.Student},
      {model: Model.School}
    ],
    where: {
      password: token
    }
  })

    .then((user) => {
      if (user) {
        if (user.Student != undefined) {
          res.render('pages/root/generate', {
            token: token,
            user: user.Student
          })
        } else {
          res.render('pages/root/generate', {
            token: token,
            user: user.Student
          })
        }
      } else {
        res.redirect('/login')
      }
    })

    .catch((err) => {
      res.send(err)
    })


})

router.get('/login', (req, res) => {
  res.render('pages/root/login', {
    msgErr: req.query.err || null
  })
})

router.post('/login', (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let id = null
  Model.User.findOne({
    include: [
      {model: Model.Student},
      {model: Model.School}
    ],
    where: {
      username: username
    }
  })
    .then((user) => {
      if (user) {
        let secret = user.secret
        const hash = crypto.createHmac('sha256', secret)
          .update(password)
          .digest('hex');
        if (hash == user.password) {
          if (user.role === 'student') {
            id = user.Student.id
            req.session.user = {
              id: id,
              username : username,
              role : user.role
            }
            res.redirect('/student/dashboard')
          } else if(user.role === 'school') {
            id = user.School.id
            req.session.user = {
              id: id,
              username : username,
              role : user.role
            }
            res.redirect('/school/dashboard')
          } else if(user.role === 'admin'){
            req.session.user = {
              id: user.id,
              username : username,
              role : user.role
            }
            res.redirect('/admin/dashboard')
          }
        } else {
          res.redirect('/login?err=wrong password')
        }

      } else {
        res.redirect('/login?err=wrong username')
      }

    })
})

router.post('/generate/:token', (req, res) => {
  let token = req.params.token
  let username = req.body.username
  let password = req.body.password
  Model.User.findOne({
    where: {
      password: token
    }
  })
  .then((user) => {
    if (username == user.username) {
      return Model.User.update(
        {
          password: password
        },
        {
          where: {
            password: token
          },
          individualHooks: true
        })
    } else {
      res.redirect(`/login?err=wrong username`)
    }
  })

  .then((data) => {
    res.redirect('/login')
  })

  .catch((err) => {
    res.send(err)
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})

router.get('/session', (req, res) => {
  res.send(req.session)
})

module.exports = router