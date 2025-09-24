import { use, expect } from 'chai'
import server from '../index.js'
import chaiHttp from 'chai-http'

const chai = use(chaiHttp)
describe('Static file server', function () {
  describe('GET /index.html', function () {
    it('It should return index.html', async function () {
      const res = await chai.request.execute(server).get('/index.html')
      expect(res).to.have.status(200)
      expect(res).to.be.html
    })
  })
  describe('GET /notfound.html', function () {
    it('It should return a 404', async function () {
      const res = await chai.request.execute(server).get('/notfound.html')
      expect(res).to.have.status(404)
    })
  })
})
