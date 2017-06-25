const halson = require('halson')

module.exports = require('express')
.Router({mergeParams: true})
.get('/', (req, res) => {
	res.json(
		halson({})
		.addLink('self', `${req.domain}${req.originalUrl}`)
		.addLink('contractors', `${req.domain}${req.originalUrl}/contractors`)
		.addLink('loginContractor', `${req.domain}${req.originalUrl}/contractors/login`)
		.addLink('consumers', `${req.domain}${req.originalUrl}/consumers`)
  	.addLink('loginConsumer', `${req.domain}${req.originalUrl}/consumers/login`)
	)
})
