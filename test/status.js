import { use, expect } from 'chai'
import server from '../index.js'
import chaiHttp from 'chai-http'

const chai = use(chaiHttp)

describe('Status API', function () {
  describe('GET /status', function () {
    it('It should return status', async function () {
      const res = await chai.request.execute(server).get('/status')
      expect(res).to.have.status(200)
      expect(res).to.be.json
      expect(res.body).to.have.property('status')
      expect(res.body).to.have.property('status').eq('ok')
    })
  })
})
