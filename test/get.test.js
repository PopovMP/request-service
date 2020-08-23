"use strict";

const qs = require("querystring");
const {init, test, done} = require("@popovmp/micro-tester");

const requestService = require("../index.js");

init("Test request-service");

test("Test `get`", () => {
    const hostname = "httpbin.org";
    const path     = "/get?" + qs.stringify({"foo": "bar"});
    const headers  = {
        "Client": "request-service",
        "Answer": 42,
    };

    requestService.get(hostname, path, headers,
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
        console.log("res.headers.Client: " + res.headers.Client);
        console.log("res.headers.Answer: " + res.headers.Answer);
    }

    console.log("Status: " + status);

    done();
}
