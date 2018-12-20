const express = require('express')
const path = require('path')
const index = require('./routes/index')
const admin = require('./routes/admin')
const school = require('./routes/school')
const student = require('./routes/student')
const session = require('express-session')

const app = express()
const port = process.env.PORT || 3000

var sess = {
  secret: 'keyboard cat',
  cookie: {}
}

app.use(session(sess))
var globalSes = (req, res, next) => {
    res.locals.session = req.session;
    next(null, req, res);
}

app.use(globalSes);
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', index)
app.use('/admin', admin)
app.use('/school', school)
app.use('/student', student)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))