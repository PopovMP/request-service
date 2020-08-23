"use strict";

const {init, test, done} = require("@popovmp/micro-tester");

const requestService = require("../index.js");

init("Test request-service");

test("Test `get`", () => {
    const url     = "https://httpbin.org/get";
    const query   = {"foo": "bar"};
    const headers = {"Answer": 42};

    requestService.get(url, query, headers,
        requestService_get_ready);

    return true;
});

function requestService_get_ready(err, data, status) {
    if (err) {
        console.error("Error: " + err);
    }

    if (data) {
        const res = JSON.parse(data);
        console.log("res.args.foo: " + res.args.foo);
        console.log("res.headers.Answer: " + res.headers.Answer);
    }

    console.log("Status: " + status);

    done();
}
