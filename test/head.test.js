"use strict";

const {strictEqual, ok} = require("assert");
const {test}            = require("node:test");

const request = require("../index.js");

test("Test HEAD request", (_, done) => {
    request.head("https://httpbin.org", {}, request_head_ready);

    /**
     * @type { ResponseCallback }
     *
     * @param { null | string } err
     * @param { Buffer | Object | string | null } data
     * @param { RequestProperties } [prop]
     */
    function request_head_ready(err, data, prop) {
        test("No errors", () => {
            ok(!err);
        });

        test("No data", () => {
            ok(!data);
        });

        test("Status code 200", () => {
            strictEqual(prop.statusCode, 200);
        });

        test("Status message \"OK\"", () => {
            strictEqual(prop.statusMessage, "OK");
        });

        setImmediate(done);
    }
});
