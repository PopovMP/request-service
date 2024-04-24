"use strict";

const {ok, strictEqual} = require("assert");
const {test}            = require("node:test");

const request = require("../index.js");

test("Test POST generic data", (_, done) => {
    const url     = "https://httpbin.org/post?foo=bar";
    const data    = {"pi": 3.14};
    const headers = {"Client": "request-service", "Answer": 42};

    request.post(url, data, headers, request_post_ready);

    /**
     * @type { ResponseCallback }
     *
     * @param { null | string } err
     * @param { Buffer | Object | string | null } data
     * @param { RequestProperties } [prop]
     */
    function request_post_ready(err, data, prop) {
        test("No errors", () => {
            ok(!err);
        });

        test("Status code 200", () => {
            strictEqual(prop.statusCode, 200);
        });

        test("Status message \"OK\"", () => {
            strictEqual(prop.statusMessage, "OK");
        });

        test("Response received", () => {
            ok(data);
        });

        test("Correct query", () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.args.foo, "bar");
        });

        test("Correct string header", () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.headers.Client, "request-service");
        });

        test("Correct numeric header", () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.headers.Answer, "42");
        });

        test("Correct data", () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.json.pi, 3.14);
        });

        setImmediate(done);
    }
});
