"use strict";

const qs = require("querystring");
const assert = require("assert");
const {init, test, ensure} = require("@popovmp/micro-tester");

const requestService = require("../index.js");

init("Run get.test.js");

test("Test `get`", () => {
    const hostname = "httpbin.org";
    const path     = "/get?" + qs.stringify({"foo": "bar"});
    const headers  = {
        "Client": "request-service",
        "Answer": 42,
    };

    requestService.get(hostname, path, headers,
        requestService_get_ready);
});

// noinspection DuplicatedCode
function requestService_get_ready(err, data, status) {
    if (err) {
        console.error("Error: " + err);
    }

    test("Response received", () => {
        assert.ok(data);
    });

    const res = JSON.parse(data);

    test("Correct res.args.foo", () => {
        assert.strictEqual(res.args.foo, "bar");
    });

    test("Correct string header", () => {
        assert.strictEqual(res.headers.Client, "request-service");
    });

    test("Correct numeric header", () => {
        assert.strictEqual(res.headers.Answer, "42");
    });

    test("Status 200", () => {
        assert.strictEqual(status, 200);
    });

    ensure();
}
