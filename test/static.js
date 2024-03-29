import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../index.js'

const expect = chai.expect
chai.use(chaiHttp)

describe('Static file server', function () {
  describe('GET /index.html', function () {
    it('It should return index.html', function (done) {
      chai
        .request(server)
        .get('/index.html')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res).to.be.html
          done(err)
        })
    })
  })
  describe('GET /notfound.html', function () {
    it('It should return a 404', function (done) {
      chai
        .request(server)
        .get('/notfound.html')
        .end((err, res) => {
          expect(res).to.have.status(404)
          done(err)
        })
    })
  })
})
