"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
let chai = require("chai");
let chaiHttp = require("chai-http");
let Express = require("express");
let renderer = require("../").default;
let expect = chai.expect;
chai.use(chaiHttp);
let server;
function findPort(startAt) {
    function getNextAvailablePort(currentPort, cb) {
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
//# sourceMappingURL=index.js.map