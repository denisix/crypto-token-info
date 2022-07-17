const chai = require('chai'),
  chaiHttp = require('chai-http'),
  expect = chai.expect,
  baseUrl = 'http://localhost:3000'

chai.use(chaiHttp)

describe("crypto-token-info test", () => {
  it('server is alive', done => {
    chai.request(baseUrl).get('/').end((err, res) => {
      expect(res).to.have.status(404)
      expect(res.text).to.equal("Not Found")
      done()
    })
  })

  it('server healthcheck /v', done => {
    chai.request(baseUrl).get('/v').end((err, res) => {
      expect(res).to.have.status(200)
      const { name, version: v } = require('../package.json')
      expect(res.text).to.equal(JSON.stringify({ name, v }))
      done()
    })
  })

  it('incorrect address format', done => {
    const address = '0xe2'
    chai.request(baseUrl).get(`/token/erc20/4/${address}`).end((err, res) => {
      const o = JSON.parse(res.text)
      expect(res).to.have.status(400)
      expect(o.error).to.equal('incorrect address format')
      done()
    })
  })

  it('invalid address checksum', done => {
    const address = '0xE27826eE778B6F78a49a686dA7D64f6E7b084a4F'
    chai.request(baseUrl).get(`/token/erc20/4/${address}`).end((err, res) => {
      const o = JSON.parse(res.text)
      expect(res).to.have.status(400)
      expect(o.error).to.equal('invalid address checksum')
      done()
    })
  })

  it('token not found', done => {
    const address = '0x3f6b3595ecF70735D3f48D69b09C4E4506DB3F47'
    chai.request(baseUrl).get(`/token/erc20/1/${address}`).end((err, res) => {
      const o = JSON.parse(res.text)
      expect(res).to.have.status(404)
      expect(o.error).to.equal('token not found')
      done()
    })
  })

  it('valid address chain - 1', done => {
    const address = '0x41eFc0253ee7Ea44400abB5F907FDbfdEbc82bec'
    chai.request(baseUrl).get(`/token/erc20/1/${address}`).end((err, res) => {
      const o = JSON.parse(res.text)
      expect(res).to.have.status(200)
      expect(o.address).to.equal(address)
      expect(o.chainId).to.equal(1)
      expect(+o.decimals).greaterThanOrEqual(0)
      expect(o.logoSmall.length).greaterThanOrEqual(0)
      expect(o.name.length).greaterThanOrEqual(3)
      expect(o.symbol.length).greaterThanOrEqual(3)
      done()
    })
  })

  it('valid address chain - 4', done => {
    const address = '0x0A057a87CE9C56D7e336B417c79cf30E8d27860B'
    chai.request(baseUrl).get(`/token/erc20/4/${address}`).end((err, res) => {
      const o = JSON.parse(res.text)
      expect(res).to.have.status(200)
      expect(o.address).to.equal(address)
      expect(o.chainId).to.equal(4)
      expect(+o.decimals).greaterThanOrEqual(0)
      expect(o.logoSmall.length).greaterThanOrEqual(0)
      expect(o.name.length).greaterThanOrEqual(3)
      expect(o.symbol.length).greaterThanOrEqual(3)
      done()
    })
  })

  it('valid address chain - 56', done => {
    const address = '0x1F64fdAD335ED784898EFFb5ce22D54d8f432523'
    chai.request(baseUrl).get(`/token/erc20/56/${address}`).end((err, res) => {
      const o = JSON.parse(res.text)
      expect(res).to.have.status(200)
      expect(o.address).to.equal(address)
      expect(o.chainId).to.equal(56)
      expect(+o.decimals).greaterThanOrEqual(0)
      expect(o.logoSmall.length).greaterThanOrEqual(0)
      expect(o.name.length).greaterThanOrEqual(3)
      expect(o.symbol.length).greaterThanOrEqual(3)
      done()
    })
  })
})
