const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");

chai.should();
chai.use(chaiHttp);

describe("Status API", function () {
  describe("GET /status", function () {
    it("It should return status", function (done) {
      chai
        .request(server)
        .get("/status")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status");
          res.body.should.have.property("status").eq("ok");
          done(err);
        });
    });
  });
});
