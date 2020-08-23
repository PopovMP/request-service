"use strict";

const qs = require("querystring");
const {init, test, done} = require("@popovmp/micro-tester");

const requestService = require("../index.js");

init("Test request-service");

test("Test `post`", () => {
    const hostname = "httpbin.org";
    const path     = "/post?" + qs.stringify({"foo": "bar"});
    const headers  = {
        "Client": "request-service",
        "Answer": 42,
    };

    const data = {"pi": 3.14};

    requestService.post(hostname, path, data, headers,
        requestService_post_ready);

    return true;
});

function requestService_post_ready(err, data, status) {
    if (err) {
        console.error("Error: " + err);
    }

    if (data) {
        const res = JSON.parse(data);
        console.log("res.headers.Client: " + res.headers.Client);
        console.log("res.headers.Answer: " + res.headers.Answer);
        console.log("res.args.foo: " + res.args.foo);
        console.log("res.json.pi: "  + res.json.pi);
    }

    console.log("Status: " + status);

    done();
}
