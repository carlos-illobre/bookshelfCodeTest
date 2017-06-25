const chakram = require('chakram')
const expect = chakram.expect
const halson = require('halson')

const url = `${process.env.WEB_DOMAIN}/rest/v1`

describe('v1', () => {

  before(() => require(`${process.env.PWD}/server.js`))

  it('gets the index', () => chakram.get(url).then(response => {
    expect(response).to.have.status(200)
    expect(response).to.comprise.of.json(
      halson()
      .addLink('self', url)
      .addLink('contractors', `${url}/contractors`)
      .addLink('loginContractor', `${url}/contractors/login`)
      .addLink('consumers', `${url}/consumers`)
      .addLink('loginConsumer', `${url}/consumers/login`)
    )
  }))

})

