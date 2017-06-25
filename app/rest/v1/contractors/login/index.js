const halson = require('halson')
const tokenGenerator = require(`${__service_dirname}/tokenGenerator.js`)
const Contractor = require(`${__model_dirname}/Contractor.js`)
const role = require('./role.js')

module.exports = require('express')
.Router({mergeParams: true})
.post('/', (req, res, next) => {

  const { email, password } = req.body

  Contractor.where({email, password}).fetch()
  .then(contractor => {
    if (!contractor) return res.sendStatus(404)
    res.status(201).json(
		  halson({
		    jwt: tokenGenerator.generate({
		      id: contractor.id,
		      role,
		    })
		  })
 		  .addLink('proposeQuote', `${req.domain}/rest/v1/contractors/me/quotes`)
	  )
  })
  .catch(next)
})
