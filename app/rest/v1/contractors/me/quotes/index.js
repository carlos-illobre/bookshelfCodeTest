const Quote = require(`${__model_dirname}/Quote.js`)

module.exports = require('express')
.Router({mergeParams: true})
.post('/', (req, res, next) => {

  const {
    contractorId
  } = req.headers

  const {
    labour,
    expenses,
    tax,
    miscellaneous,
    consumerId,
  } = req.body
  
  new Quote({
    labour,
    expenses,
    tax,
    miscellaneous,
    consumer_id: consumerId,
    contractor_id: contractorId,
  })
  .save()
  .then(quote => {
    res.setHeader('Location', `${req.domain}${req.originalUrl}/${quote.id}`)
    res.sendStatus(201)
  })
  .catch(next)

})

