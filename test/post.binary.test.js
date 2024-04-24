"use strict";

const {ok, strictEqual} = require("assert");
const {test}            = require("node:test");

const request = require("../index.js");

test("Test POST binary data", (_, done) => {
	const url    = "https://httpbin.org/post?foo=bar";
	const buffer = Buffer.from("foo");

	request.post(url, buffer, {}, requestService_ready);

    /**
     * @type { ResponseCallback }
     *
     * @param { null | string } err
     * @param { Buffer | Object | string | null } data
     * @param { RequestProperties } [prop]
     */
    function requestService_ready(err, data, prop) {
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

        test("Correct data", () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.data, "foo");
        });

        setImmediate(done);
    }
});
