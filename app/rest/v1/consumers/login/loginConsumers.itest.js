const chakram = require('chakram')
const expect = chakram.expect
const halson = require('halson')

const url = `${process.env.WEB_DOMAIN}/rest/v1/consumers`
const role = require('./role.js')

let knex, Consumer, tokenGenerator

describe('loginConsumers', () => {

  before(() => {
    require(`${process.env.PWD}/server.js`)
    knex = require('knex')(require(`${__root_dirname}/knexfile.js`).development)
    Consumer = require(`${__model_dirname}/Consumer.js`)
    tokenGenerator = require(`${__service_dirname}/tokenGenerator.js`)
  })
  
  beforeEach(() => knex.migrate.rollback().then(() => knex.migrate.latest()))
  after(() => knex.migrate.rollback())

  it('login a consumer', () => {

    const consumer = {
      name: 'some_name',
      email: 'some@email',
      password: 'some_password',
    }

    return chakram.post(url, consumer)
    .then(response => {
      return response.response.headers.location.replace(`${url}/`, '')
    })
    .then(id => Promise.all([
      parseInt(id),
      chakram.post(`${url}/login`, {
        email: consumer.email,
        password: consumer.password,
      }),
    ]))
    .then(([id, response]) => {
      expect(response).to.have.status(201)
      expect(response).to.comprise.of.json(
        halson({
          jwt: tokenGenerator.generate({ id, role })
        })
   		  .addLink('acceptQuote', url + '/me/quotes/{quoteId}/accept')
  		  .addLink('rejectQuote', url + '/me/quotes/{quoteId}/reject')
      )
    })
  })

})

