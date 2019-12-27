const mongoose = require('mongoose')
const express = require('express')
const Schema = mongoose.Schema
const app = express()
const jsonParser = express.json()
const path = require('path')
const userScheme = new Schema({ name: String, age: Number, phone: Number}, { versionKey: false })
const User = mongoose.model('User', userScheme)
const dbConfig = require('./db')
// const url = dbConfig.MONGOLAB_URI || process.env.MONGOLAB_URI
// app.use(express.static(__dirname + '/public'))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})
mongoose.connect(dbConfig.MONGOLAB_URI || process.env.MONGOLAB_URI, { useNewUrlParser: true, useCreateIndex: true }, function (err) {
  if (err) return console.log(err)
  const port = process.env.PORT || 8800
  app.listen(port, function () {
    console.log('Сервер ожидает подключения... ' + port)
  })
})
mongoose.set('useFindAndModify', false)
app.get('/api/users', function (req, res) {
  User.find({}, function (err, users) {
    if (err) return console.log(err)
    res.send(users)
  })
})

app.get('/api/users/:id', function (req, res) {
  const id = req.params.id
  User.findOne({ _id: id }, function (err, user) {
    if (err) return console.log(err)
    res.send(user)
  })
})

app.post('/api/users', jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)

  const userName = req.body.name
  const userAge = req.body.age
  const userPhone = req.body.phone
  const user = new User({ name: userName, age: userAge, phone: userPhone })

  user.save(function (err) {
    if (err) return console.log(err)
    res.send(user)
  })
})

app.delete('/api/users/:id', function (req, res) {
  const id = req.params.id
  User.findByIdAndDelete(id, function (err, user) {
    if (err) return console.log(err)
    console.log('user with id was deleted ' + id)
    res.send(user)
  })
})

app.put('/api/users', jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  const id = req.body.id
  const userName = req.body.name
  const userAge = req.body.age
  const userPhone = req.body.phone
  const newUser = { age: userAge, name: userName, phone: userPhone }

  User.findOneAndUpdate({ _id: id }, newUser, { new: true }, function (err, user) {
    if (err) return console.log(err)
    res.send(user)
  })
})
