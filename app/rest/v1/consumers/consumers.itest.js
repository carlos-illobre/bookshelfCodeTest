const chakram = require('chakram')
const expect = chakram.expect
const halson = require('halson')

const url = `${process.env.WEB_DOMAIN}/rest/v1/consumers`

let knex, Consumer

describe('consumers', () => {

  before(() => {
    require(`${process.env.PWD}/server.js`)
    knex = require('knex')(require(`${__root_dirname}/knexfile.js`).development)
    Consumer = require(`${__model_dirname}/Consumer.js`)
  })
  
  beforeEach(() => knex.migrate.rollback().then(() => knex.migrate.latest()))
  after(() => knex.migrate.rollback())

  it('creates a new consumer', () => {

    const consumerData = {
      name: 'some_name',
      email: 'some@email',
      password: 'some_password',
    }

    return chakram.post(url, consumerData)
    .then(response => {
      expect(response).to.have.status(201)
      expect(response).to.have.header('Location')
      const location = response.response.headers.location
      expect(location.startsWith(url)).to.be.true
      return location.replace(`${url}/`, '')
    })
    .then(id => Consumer.where({id}).fetch())
    .then(consumer => {
       expect(consumer.get('name')).to.equals(consumerData.name)
       expect(consumer.get('email')).to.equals(consumerData.email)
       expect(consumer.get('password')).to.equals(consumerData.password)
       // I also have to test if the email was sent, to mock that I would use Nock: https://github.com/node-nock/nock
    })
  })

})
