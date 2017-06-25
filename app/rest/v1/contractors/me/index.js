const tokenGenerator = require(`${__service_dirname}/tokenGenerator.js`)
const role = require('../login/role.js')

module.exports = require('express')
.Router({mergeParams: true})
.all('/*', (req, res, next) => Promise.resolve(req.headers.jwt)
  .then(jwt => {
    if (!jwt) throw 'undefined jwt'
    return tokenGenerator.verify(jwt)
  })
  .then(data => {
    if (data.role != role) throw 'bad role'
    req.headers.contractorId = data.id
    return next()
  })
  .catch(error => res.sendStatus(401))
)

