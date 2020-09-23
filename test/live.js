const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");

const expect = chai.expect;
chai.use(chaiHttp);

describe("Live API", function () {
  describe("POST /live", function () {
    it("It should return 400", function (done) {
      chai
        .request(server)
        .get("/live")
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res).to.be.a("object");
          expect(res.body).to.have.property("message");
          expect(res.body).to.have.property("message").eq("missing parameters");
          done(err);
        });
    });
  });
});
