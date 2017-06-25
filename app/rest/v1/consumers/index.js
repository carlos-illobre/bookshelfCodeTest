const Consumer = require(`${__model_dirname}/Consumer.js`)
const sendEmail = require(`${__service_dirname}/sendEmail.js`)

module.exports = require('express')
.Router({mergeParams: true})
.post('/', (req, res, next) => {
  new Consumer({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  })
  .save()
  .then(consumer => {
    sendEmail({
      email: consumer.get('email'),
      title: 'Consumer Registration', 
      body: 'mail text',
    })
    res.setHeader('Location', `${req.domain}${req.originalUrl}/${consumer.id}`)
    res.sendStatus(201)
  })
  .catch(next)
})

