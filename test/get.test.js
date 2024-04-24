"use strict";

const {ok, strictEqual} = require("assert");
const {test} = require("node:test");

const request = require("../index.js");

const url     = "https://httpbin.org/get?foo=bar";
const headers = {
    "Client": "request-service",
    "Answer": 42,
};

test("Test GET generic data", (_, done) => {
	request.get(url, headers, requestService_ready);

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

		test("Response received", () => {
			ok(data);
		});

		test("Status code 200", () => {
			strictEqual(prop.statusCode, 200);
		});

		test("Status message \"OK\"", () => {
			strictEqual(prop.statusMessage, "OK");
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

		setImmediate(done);
	}
});
