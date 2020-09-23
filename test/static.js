const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");

const expect = chai.expect;
chai.use(chaiHttp);

describe("Static file server", function () {
  describe("GET /index.html", function () {
    it("It should return index.html", function (done) {
      chai
        .request(server)
        .get("/index.html")
        .end((err, res) => {
          expect(res).to.have.status(200);
          done(err);
        });
    });
  });
  describe("GET /notfound.html", function () {
    it("It should return a 404", function (done) {
      chai
        .request(server)
        .get("/notfound.html")
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });
  });
});
