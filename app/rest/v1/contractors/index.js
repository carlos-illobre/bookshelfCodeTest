const Contractor = require(`${__model_dirname}/Contractor.js`)
const sendEmail = require(`${__service_dirname}/sendEmail.js`)

module.exports = require('express')
.Router({mergeParams: true})
.post('/', (req, res, next) => {
  new Contractor({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  })
  .save()
  .then(contractor => {
    sendEmail({
      email: contractor.get('email'),
      title: 'Contractor Registration', 
      body: 'mail text',
    })
    res.setHeader('Location', `${req.domain}${req.originalUrl}/${contractor.id}`)
    res.sendStatus(201)
  })
  .catch(next)
})

