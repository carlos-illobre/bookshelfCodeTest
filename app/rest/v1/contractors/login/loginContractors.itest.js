const chakram = require('chakram')
const expect = chakram.expect
const halson = require('halson')

const url = `${process.env.WEB_DOMAIN}/rest/v1/contractors`
const role = require('./role.js')

let knex, Contractor, tokenGenerator, contractorRole

describe('loginContractors', () => {

  before(() => {
    require(`${process.env.PWD}/server.js`)
    knex = require('knex')(require(`${__root_dirname}/knexfile.js`).development)
    Contractor = require(`${__model_dirname}/Contractor.js`)
    tokenGenerator = require(`${__service_dirname}/tokenGenerator.js`)
  })
  
  beforeEach(() => knex.migrate.rollback().then(() => knex.migrate.latest()))
  after(() => knex.migrate.rollback())

  it('login a contractor', () => {

    const contractor = {
      name: 'some_name',
      email: 'some@email',
      password: 'some_password',
    }

    return chakram.post(url, contractor)
    .then(response => {
      return response.response.headers.location.replace(`${url}/`, '')
    })
    .then(id => Promise.all([
      parseInt(id),
      chakram.post(`${url}/login`, {
        email: contractor.email,
        password: contractor.password,
      }),
    ]))
    .then(([id, response]) => {
      expect(response).to.have.status(201)
      expect(response).to.comprise.of.json(
        halson({
          jwt: tokenGenerator.generate({ id, role })
        })
   		  .addLink('proposeQuote', `${url}/me/quotes`)
      )
    })
  })

})

