"use strict";

const {strictEqual} = require("assert");
const {test}        = require("node:test");

const request = require("../index.js");

const url = "https://httpbin.org/delay/3";

test("Test timeout", (_, done) => {
    request.get(url, {"Request-Timeout": 1}, request_get_ready);

    /**
     * @type { ResponseCallback }
     *
     * @param { null | string } err
     * @param { Buffer | Object | string | null } data
     * @param { RequestProperties } [_prop]
     */
    function request_get_ready(err, data, _prop) {
        test("Socket hang up", () => {
            strictEqual(err, "socket hang up");
        });

	    test("No data", () => {
		    strictEqual(data, null);
	    });

        setImmediate(done);
    }
});
