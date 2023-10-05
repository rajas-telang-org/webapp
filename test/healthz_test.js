import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js"; // Import your Express app instance

const { expect } = chai;

chai.use(chaiHttp);

describe("/healthz API", () => {
  it("should return status 200 and success message", (done) => {
    chai
      .request(app)
      .get("/healthz")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("status").eql("Success");
        done();
      });
  });
});

after(() => {
  console.log("test completed");
  process.exit(0);
});
