import { use, expect } from 'chai'
import server from '../index.js'
import chaiHttp from 'chai-http'

const chai = use(chaiHttp)

describe('Live API', function () {
  describe('POST /live', function () {
    it('It should return 400', async function () {
      const res = await chai.request.execute(server).get('/live')
      expect(res).to.have.status(400)
      expect(res).to.be.a('object')
      expect(res.body).to.have.property('message')
      expect(res.body).to.have.property('message').eq('missing parameters')
    })
  })
})
