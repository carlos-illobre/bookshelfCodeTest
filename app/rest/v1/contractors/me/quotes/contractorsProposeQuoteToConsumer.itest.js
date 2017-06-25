const chakram = require('chakram')
const expect = chakram.expect
const halson = require('halson')

const contractorUrl = `${process.env.WEB_DOMAIN}/rest/v1/contractors`
const loginContractorUrl = `${process.env.WEB_DOMAIN}/rest/v1/contractors/login`
const loginConsumerUrl = `${process.env.WEB_DOMAIN}/rest/v1/consumers/login`
const consumerUrl = `${process.env.WEB_DOMAIN}/rest/v1/consumers`
const url = `${process.env.WEB_DOMAIN}/rest/v1/contractors/me/quotes`

let knex, Contractor

describe('contractorsProposeQuoteToConsumer', () => {

  before(() => {
    require(`${process.env.PWD}/server.js`)
    knex = require('knex')(require(`${__root_dirname}/knexfile.js`).development)
    Quote = require(`${__model_dirname}/Quote.js`)
  })
  
  beforeEach(() => knex.migrate.rollback().then(() => knex.migrate.latest()))
  after(() => knex.migrate.rollback())

  it('propose a quote to a consumer', () => {

    const email = 'contractor@email'
    const password = 'some_password'
    
    const quoteData = {
      labour: 'some_labour',
      expenses: 8733.11,
      tax: 7334.31,
      miscellaneous: 'some_miscelaleous',
    }

    return Promise.all([
      chakram.post(contractorUrl, {
        name: 'some_contractor',
        email,
        password,
      }),
      chakram.post(consumerUrl, {
        name: 'some_consumer',
        email: 'consumer@email',
        password: 'some_password',
      }),
    ])
    .then(([contractorResponse, consumerResponse]) => Promise.all([
      contractorResponse.response.headers.location.replace(`${contractorUrl}/`, ''),
      consumerResponse.response.headers.location.replace(`${consumerUrl}/`, ''),
      chakram.post(loginContractorUrl, { email, password }),
    ]))
    .then(([contractorId, consumerId, response]) => [
      contractorId,
      consumerId,
      response.body.jwt
    ])
    .then(([contractorId, consumerId, jwt]) => Promise.all([
      contractorId,
      consumerId,
      chakram.post(url, {
        labour: quoteData.labour,
        expenses: quoteData.expenses,
        tax: quoteData.tax,
        miscellaneous: quoteData.miscellaneous,
        consumerId,
      }, { headers: { jwt } }),
    ]))
    .then(([contractorId, consumerId, response]) => {
      expect(response).to.have.status(201)
      expect(response).to.have.header('Location')
      const location = response.response.headers.location
      expect(location.startsWith(url)).to.be.true
      return [contractorId, consumerId, location.replace(`${url}/`, '')]
    })
    .then(([contractorId, consumerId, quoteId]) => Promise.all([
      contractorId,
      consumerId,
      Quote.where({ id: quoteId }).fetch(),
    ]))
    .then(([contractorId, consumerId, quote]) => {
      expect(quote.get('labour')).to.equals(quoteData.labour)
      expect(quote.get('expenses')).to.equals(`${quoteData.expenses}`)
      expect(quote.get('tax')).to.equals(`${quoteData.tax}`)
      expect(quote.get('miscellaneous')).to.equals(quoteData.miscellaneous)
      expect(quote.get('contractor_id')).to.equals(parseInt(contractorId))
      expect(quote.get('consumer_id')).to.equals(parseInt(consumerId))
      expect(quote.get('created_at')).to.exist
    })
  })

  it('returns 401 if not jwt', () => chakram.post(url, {
      labour: 'some_labour',
      expenses: 45,
      tax: 55,
      consumerId: 1,
    })
    .then(response => {
      expect(response).to.have.status(401)
    })
  )
  
  it('returns 401 if bad jwt', () => chakram.post(url, {
      labour: 'some_labour',
      expenses: 45,
      tax: 55,
      consumerId: 1,
    }, { headers: { jwt: 'bad_jwt' } })
    .then(response => {
      expect(response).to.have.status(401)
    })
  )

  it('returns 401 if the logged user is a consumer', () => {

    const email = 'consumer@email'
    const password = 'some_password'
    
    const quoteData = {
      labour: 'some_labour',
      expenses: 8733.11,
      tax: 7334.31,
      miscellaneous: 'some_miscelaleous',
    }

    return Promise.all([
      chakram.post(contractorUrl, {
        name: 'some_contractor',
        email: 'contractor@email',
        password: 'some_password',
      }),
      chakram.post(consumerUrl, {
        name: 'some_consumer',
        email,
        password,
      }),
    ])
    .then(([contractorResponse, consumerResponse]) => Promise.all([
      contractorResponse.response.headers.location.replace(`${contractorUrl}/`, ''),
      consumerResponse.response.headers.location.replace(`${consumerUrl}/`, ''),
      chakram.post(loginConsumerUrl, { email, password }),
    ]))
    .then(([contractorId, consumerId, response]) => [
      contractorId,
      consumerId,
      response.body.jwt
    ])
    .then(([contractorId, consumerId, jwt]) => Promise.all([
      contractorId,
      consumerId,
      chakram.post(url, {
        labour: quoteData.labour,
        expenses: quoteData.expenses,
        tax: quoteData.tax,
        miscellaneous: quoteData.miscellaneous,
        consumerId,
      }, { headers: { jwt } }),
    ]))
    .then(([contractorId, consumerId, response]) => {
      expect(response).to.have.status(401)
    })
  })

  // I have to test the field types, the not null fields and the cases of an expired jwt
})
