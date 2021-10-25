import * as http from "http";

let chai = require("chai");
let chaiHttp = require("chai-http");
let Express = require("express");
let renderer = require("../").default;
let expect = chai.expect;
chai.use(chaiHttp);

let server: http.Server;

function findPort(startAt: number) {
  function getNextAvailablePort(
    currentPort: number,
    cb: (port: number) => void
  ) {
    const server = http.createServer();
    server.listen(currentPort, () => {
      server.once("close", () => {
        cb(currentPort);
      });
      server.close();
    });
    server.on("error", () => {
      getNextAvailablePort(++currentPort, cb);
    });
  }

  return new Promise((resolve) => {
    getNextAvailablePort(startAt, resolve);
  });
}

beforeEach("Starting express", async () => {
  let app = Express();
  app.set("view engine", "pug");
  app.use(renderer());
  app.use((req, res, next) => {
    res.send("not found");
  });

  let port = await findPort(3000);
  await new Promise((resolve) => {
    server = app.listen(port, resolve);
  });
});

afterEach((done) => {
  http.createServer().close(() => {
    done();
  });
});

describe("index", function () {
  let result = "<p>index.pug</p>";
  it("should render the index by /", async function () {
    let res = await chai.request(server).get("/");
    expect(res).to.have.status(200);
    expect(res.text).to.be.equal(result);
  });

  it("should render the index by name without .html", async function () {
    let res = await chai.request(server).get("/index");
    expect(res).to.have.status(200);
    expect(res.text).to.be.equal(result);
  });

  it("should render the index by name with .html", async function () {
    let res = await chai.request(server).get("/index.html");
    expect(res).to.have.status(200);
    expect(res.text).to.be.equal(result);
  });
});

describe("other files", function () {
  describe("a.pug", function () {
    let result = "<p>a.pug</p>";
    it("should render a.pug by name without extension", async function () {
      let res = await chai.request(server).get("/a");
      expect(res).to.have.status(200);
      expect(res.text).to.be.equal(result);
    });

    it("should render a.pug by name with .html", async function () {
      let res = await chai.request(server).get("/a.html");
      expect(res).to.have.status(200);
      expect(res.text).to.be.equal(result);
    });
  });

  describe("b/index.pug", function () {
    let result = "<p>b/index.pug</p>";
    it("should render b/index.pug from /b", async function () {
      let res = await chai.request(server).get("/b");
      expect(res).to.have.status(200);
      expect(res.text).to.be.equal(result);
    });

    it("should render b/index.pug from /b/", async function () {
      let res = await chai.request(server).get("/b/");
      expect(res).to.have.status(200);
      expect(res.text).to.be.equal(result);
    });

    it("should render b/index.pug from /b/index", async function () {
      let res = await chai.request(server).get("/b/index");
      expect(res).to.have.status(200);
      expect(res.text).to.be.equal(result);
    });

    it("should render b/index.pug from /b/index.html", async function () {
      let res = await chai.request(server).get("/b/index.html");
      expect(res).to.have.status(200);
      expect(res.text).to.be.equal(result);
    });
  });

  describe("b/c.pug", function () {
    let result = "<p>b/c.pug</p>";
    it("should render b/c.pug from /b/c", async function () {
      let res = await chai.request(server).get("/b/c");
      expect(res).to.have.status(200);
      expect(res.text).to.be.equal(result);
    });

    it("should render b/c.pug from /b/c.html", async function () {
      let res = await chai.request(server).get("/b/c.html");
      expect(res).to.have.status(200);
      expect(res.text).to.be.equal(result);
    });
  });

  describe("passthrough", function () {
    it("should pass through if file not found", async function () {
      let res = await chai.request(server).get("/notfound.html");
      expect(res).to.have.status(200);
      expect(res.text).to.be.equal("not found");
    });
  });
});
