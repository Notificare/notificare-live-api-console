const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')

const expect = chai.expect
chai.use(chaiHttp)

describe('Status API', function () {
  describe('GET /status', function () {
    it('It should return status', function (done) {
      chai
        .request(server)
        .get('/status')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res).to.be.json
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('status').eq('ok')
          done(err)
        })
    })
  })
})
