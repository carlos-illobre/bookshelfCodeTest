const chakram = require('chakram')
const expect = chakram.expect
const halson = require('halson')

const contractorUrl = `${process.env.WEB_DOMAIN}/rest/v1/contractors`
const loginContractorUrl = `${process.env.WEB_DOMAIN}/rest/v1/contractors/login`
const loginConsumerUrl = `${process.env.WEB_DOMAIN}/rest/v1/consumers/login`
const consumerUrl = `${process.env.WEB_DOMAIN}/rest/v1/consumers`
const quoteUrl = `${process.env.WEB_DOMAIN}/rest/v1/contractors/me/quotes`
const acceptQuoteUrl = `${process.env.WEB_DOMAIN}/rest/v1/consumers/me/quotes/{quoteId}/accept`

let knex, Contractor, quoteStates

describe('consumerAcceptQuote', () => {

  before(() => {
    require(`${process.env.PWD}/server.js`)
    knex = require('knex')(require(`${__root_dirname}/knexfile.js`).development)
    Quote = require(`${__model_dirname}/Quote.js`)
    quoteStates = require(`${__enums_dirname}/quoteStates.js`)
  })
  
  beforeEach(() => knex.migrate.rollback().then(() => knex.migrate.latest()))
  after(() => knex.migrate.rollback())

  it('accept quote', () => {

    const contractorEmail = 'contractor@email'
    const contractorPassword = 'some_password'
    
    const consumerEmail = 'consumer@email'
    const consumerPassword = 'some_password'
    
    const quoteData = {
      labour: 'some_labour',
      expenses: 8733.11,
      tax: 7334.31,
      miscellaneous: 'some_miscelaleous',
    }

    return Promise.all([
      chakram.post(contractorUrl, {
        name: 'some_contractor',
        email: contractorEmail,
        password: contractorPassword,
      }),
      chakram.post(consumerUrl, {
        name: 'some_consumer',
        email: consumerEmail,
        password: consumerPassword,
      }),
    ])
    .then(([contractorResponse, consumerResponse]) => Promise.all([
      contractorResponse.response.headers.location.replace(`${contractorUrl}/`, ''),
      consumerResponse.response.headers.location.replace(`${consumerUrl}/`, ''),
      chakram.post(loginContractorUrl, {
        email: contractorEmail,
        password: contractorPassword,
      }),
    ]))
    .then(([contractorId, consumerId, loginContractor]) => [
      contractorId,
      consumerId,
      loginContractor.body.jwt
    ])
    .then(([contractorId, consumerId, contractorJwt]) => Promise.all([
      contractorId,
      consumerId,
      chakram.post(quoteUrl, {
        labour: quoteData.labour,
        expenses: quoteData.expenses,
        tax: quoteData.tax,
        miscellaneous: quoteData.miscellaneous,
        consumerId,
      }, { headers: { jwt: contractorJwt } }),
    ]))
    .then(([contractorId, consumerId, quoteResponse]) => Promise.all([
      contractorId,
      consumerId,
      quoteResponse.response.headers.location.replace(`${quoteUrl}/`, ''),
      chakram.post(loginConsumerUrl, {
        email: consumerEmail,
        password: consumerPassword,
      }),
    ]))
    .then(([contractorId, consumerId, quoteId, loginConsumer]) => [
      contractorId,
      consumerId,
      quoteId,
      loginConsumer.body.jwt,
    ])
    .then(([contractorId, consumerId, quoteId, consumerJwt]) => Promise.all([
      contractorId,
      consumerId,
      quoteId,
      chakram.put(acceptQuoteUrl.replace('{quoteId}', quoteId), {}, {
        headers: { jwt: consumerJwt }
      }),
    ]))
    .then(([contractorId, consumerId, quoteId, response]) => {
      expect(response).to.have.status(204)
      return Promise.all([
        contractorId,
        consumerId,
        Quote.where({ id: quoteId }).fetch(),        
      ])
    })
    .then(([contractorId, consumerId, quote]) => {
      expect(quote.get('labour')).to.equals(quoteData.labour)
      expect(quote.get('expenses')).to.equals(`${quoteData.expenses}`)
      expect(quote.get('tax')).to.equals(`${quoteData.tax}`)
      expect(quote.get('miscellaneous')).to.equals(quoteData.miscellaneous)
      expect(quote.get('contractor_id')).to.equals(parseInt(contractorId))
      expect(quote.get('consumer_id')).to.equals(parseInt(consumerId))
      expect(quote.get('created_at')).to.exist
      expect(quote.get('state')).to.equals(quoteStates.accepted)
    })
  })

  it('returns 401 if not jwt', () => chakram.put(acceptQuoteUrl)
    .then(response => {
      expect(response).to.have.status(401)
    })
  )
  
  it('returns 401 if bad jwt', () => chakram.put(acceptQuoteUrl, {}, {
    headers: { jwt: 'bad_jwt' } })
    .then(response => {
      expect(response).to.have.status(401)
    })
  )
  
  // I have to test 401 if the jwt is not from a consumer

})
