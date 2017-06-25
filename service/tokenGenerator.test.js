const jwt = require('jsonwebtoken')
const expect = require('chai').expect

const tokenGenerator = require('./tokenGenerator.js')

describe('Token generator', () => {

  it('Generates a jwt', () => {
    const data = {
      id: 23,
      email: 'some@email',
    }
    const token = tokenGenerator.generate(data)
    const actual = jwt.verify(token, tokenGenerator.key)
    expect(actual.id).to.equal(data.id)
    expect(actual.email).to.equal(data.email)
  })
  
  it('verify token data', () => {
    const data = {
      id: 56,
      email: 'other@email',
    }
    const token = tokenGenerator.generate(data)
    const actual = tokenGenerator.verify(token)
    expect(actual.id).to.equal(data.id)
    expect(actual.email).to.equal(data.email)
  })
  
  it('Reads token data', () => {
    expect(() => tokenGenerator.verify('bad_token')).to.throw()
  })

})

