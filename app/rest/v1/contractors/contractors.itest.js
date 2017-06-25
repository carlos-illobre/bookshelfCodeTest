const chakram = require('chakram')
const expect = chakram.expect
const halson = require('halson')

const url = `${process.env.WEB_DOMAIN}/rest/v1/contractors`

let knex, Contractor

describe('contractors', () => {

  before(() => {
    require(`${process.env.PWD}/server.js`)
    knex = require('knex')(require(`${__root_dirname}/knexfile.js`).development)
    Contractor = require(`${__model_dirname}/Contractor.js`)
  })
  
  beforeEach(() => knex.migrate.rollback().then(() => knex.migrate.latest()))
  after(() => knex.migrate.rollback())

  it('creates a new contractor', () => {

    const contractorData = {
      name: 'some_name',
      email: 'some@email',
      password: 'some_password',
    }

    return chakram.post(url, contractorData)
    .then(response => {
      expect(response).to.have.status(201)
      expect(response).to.have.header('Location')
      const location = response.response.headers.location
      expect(location.startsWith(url)).to.be.true
      return location.replace(`${url}/`, '')
    })
    .then(id => Contractor.where({id}).fetch())
    .then(contractor => {
       expect(contractor.get('name')).to.equals(contractorData.name)
       expect(contractor.get('email')).to.equals(contractorData.email)
       expect(contractor.get('password')).to.equals(contractorData.password)
       // I also have to test if the email was sent, to mock that I would use Nock: https://github.com/node-nock/nock
    })
  })

})
