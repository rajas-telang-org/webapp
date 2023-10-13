import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js"; // Import your Express app instance

chai.use(chaiHttp);
const expect = chai.expect;

describe("Healthz Endpoint", () => {
  it("should return a 200 status", async () => {
    const response = await chai.request(app).get("/healthzzzz");
    expect(response.status).to.equal(200);
  });
});
