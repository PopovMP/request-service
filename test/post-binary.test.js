"use strict";

const assert = require("assert");
const {init, test, ensure} = require("@popovmp/micro-tester");

const requestService = require("../index.js");

init("Run post.test.js");

test("Test `post`", () => {
    const hostname = "httpbin.org";
    const path     = "/post";
    const headers  = {};

    const data = Buffer.from("foo");

    requestService.post(hostname, path, data, headers,
        requestService_post_ready);
});

// noinspection DuplicatedCode
function requestService_post_ready(err, data, status) {
    if (err) {
        console.error("Error: " + err);
    }

    test("Response received", () => {
        assert.ok(data);
    });


    test("Receive buffer", () => {
        assert.ok(Buffer.isBuffer(data));
    });

    test("Correct data", () => {
        const res = JSON.parse(data); // Because https://httpbin.org returns JSON
        assert.strictEqual(res.data, "foo");
    });

    test("Status 200", () => {
        assert.strictEqual(status, 200);
    });

    ensure();
}
