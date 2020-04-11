import { expect } from "chai";
import * as request from "request";

const baseAPI = "http://localhost:5000/api/v1/budget/";
console.log(baseAPI);

const data = {
  amount: 1000,
  type: "budget",
  date: "2020-04-11",
  purpose: "All",
  description: "this budget is for all expenses",
};
const invalidData = {
  type: "budget",
  date: "2020-04-11",
  description: "Al Rush restauraint",
};

let id;
const invalidId = "5e917bb35ee5053deab7c3f0";

describe("BUDGET API", () => {
  /**************** BUDGET API ***************/
  describe("POST /add", function () {
    it("should add successfully!", function (done) {
      let options = {
        url: baseAPI + "add",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
        json: true,
      };
      request.post(options, function (error, res, body) {
        id = body.result._id;
        expect(res.statusCode).to.equal(201);
        expect(body.code).to.equal(201);
        expect(body.status).to.equal(true);
        expect(body).to.have.property("result");
        expect(body.result).to.be.an("object");
        done();
      });
    });
    it("should return invalid input parameters!", function (done) {
      let options = {
        url: baseAPI + "add",
        headers: {
          "Content-Type": "application/json",
        },
        body: invalidData,
        json: true,
      };
      request.post(options, function (error, res, body) {
        expect(res.statusCode).to.equal(400);
        expect(body.code).to.equal(400);
        expect(body.status).to.equal(false);
        expect(body).to.have.property("result");
        expect(body.result).to.be.an("array");
        done();
      });
    });
  });

  describe("GET /get/:id", function () {
    it("should get successfully!", function (done) {
      let options = {
        url: `${baseAPI}get/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        json: true,
      };
      request.get(options, function (error, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body.code).to.equal(200);
        expect(body.status).to.equal(true);
        expect(body).to.have.property("result");
        expect(body.result).to.be.an("object");
        done();
      });
    });
    it("should return record doesn't exist!", function (done) {
      let options = {
        url: `${baseAPI}get/${invalidId}`,
        headers: {
          "Content-Type": "application/json",
        },
        json: true,
      };
      request.get(options, function (error, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body.code).to.equal(200);
        expect(body.status).to.equal(false);
        expect(body).to.have.property("result");
        expect(body.result).to.be.an("array");
        done();
      });
    });
  });

  describe("GET /get-list", function () {
    it("should get all record successfully!", function (done) {
      let options = {
        url: `${baseAPI}get-list`,
        headers: {
          "Content-Type": "application/json",
        },
        json: true,
      };
      request.get(options, function (error, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body.code).to.equal(200);
        expect(body.status).to.equal(true);
        expect(body).to.have.property("result");
        expect(body.result).to.be.an("array");
        done();
      });
    });
  });

  describe("PUT /edit/:id", function () {
    it("should update successfully!", function (done) {
      let options = {
        url: `${baseAPI}edit/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
        json: true,
      };
      request.put(options, function (error, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body.code).to.equal(200);
        expect(body.status).to.equal(true);
        expect(body).to.have.property("result");
        expect(body.result).to.be.an("array");
        done();
      });
    });
    it("should return invalid input parameters!", function (done) {
      let options = {
        url: `${baseAPI}edit/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        body: invalidData,
        json: true,
      };
      request.put(options, function (error, res, body) {
        expect(res.statusCode).to.equal(400);
        expect(body.code).to.equal(400);
        expect(body.status).to.equal(false);
        expect(body).to.have.property("result");
        expect(body.result).to.be.an("array");
        done();
      });
    });
    it("should return record doesn't exist!", function (done) {
      let options = {
        url: `${baseAPI}edit/${invalidId}`,
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
        json: true,
      };
      request.put(options, function (error, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body.code).to.equal(200);
        expect(body.status).to.equal(false);
        expect(body).to.have.property("result");
        expect(body.result).to.be.an("array");
        done();
      });
    });
  });

  describe("DELETE /delete/:id", function () {
    it("should delete successfully!", function (done) {
      let options = {
        url: `${baseAPI}delete/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        json: true,
      };
      request.delete(options, function (error, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body.code).to.equal(200);
        expect(body.status).to.equal(true);
        expect(body).to.have.property("result");
        expect(body.result).to.be.an("array");
        done();
      });
    });
    it("should return record doesn't exist!", function (done) {
      let options = {
        url: `${baseAPI}delete/${invalidId}`,
        headers: {
          "Content-Type": "application/json",
        },
        json: true,
      };
      request.delete(options, function (error, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body.code).to.equal(200);
        expect(body.status).to.equal(false);
        expect(body).to.have.property("result");
        expect(body.result).to.be.an("array");
        done();
      });
    });
  });
});
