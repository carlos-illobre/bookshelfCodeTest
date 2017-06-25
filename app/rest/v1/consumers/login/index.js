const halson = require('halson')
const tokenGenerator = require(`${__service_dirname}/tokenGenerator.js`)
const Consumer = require(`${__model_dirname}/Consumer.js`)
const role = require('./role.js')

module.exports = require('express')
.Router({mergeParams: true})
.post('/', (req, res, next) => {

  const { email, password } = req.body

  Consumer.where({email, password}).fetch()
  .then(consumer => {
    if (!consumer) return res.sendStatus(404)
    res.status(201).json(
		  halson({
		    jwt: tokenGenerator.generate({
		      id: consumer.id,
		      role,
		    })
		  })
		  .addLink('acceptQuote', `${req.domain}/rest/v1/consumers/me/quotes/{quoteId}/accept`)
		  .addLink('rejectQuote', `${req.domain}/rest/v1/consumers/me/quotes/{quoteId}/reject`)
	  )
  })
  .catch(next)
})
