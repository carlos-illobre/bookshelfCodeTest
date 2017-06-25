const quoteStates = require(`${__enums_dirname}/quoteStates.js`)
const Quote = require(`${__model_dirname}/Quote.js`)

module.exports = require('express')
.Router({mergeParams: true})
.put('/', (req, res, next) => {

  const {
    consumerId,
  } = req.headers
  
  const {
    quoteId,
  } = req.params
  
  Quote.where({
    id: quoteId,
    consumer_id: consumerId,
  })
  .save({ state: quoteStates.accepted }, { patch: true })
  .then(() => res.sendStatus(204))
  .catch(next)

})

