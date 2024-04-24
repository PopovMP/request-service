"use strict";

const {strictEqual}  = require("assert");
const {test} = require("node:test");

const request = require("../index.js");
const url     = "https://datafeed.dukascopy.com/datafeed/USATECHIDXUSD/2021/11/03/22h_ticks.bi5";

test("Test GET 0 bytes", (_, done) => {
    request.get(url, {"Request-Timeout": 3}, request_get_ready);

    /**
     * @type { ResponseCallback }
     *
     * @param { null | string } err
     * @param { Buffer | Object | string | null } data
     * @param { RequestProperties } [prop]
     */
    function request_get_ready(err, data, prop) {
        test("No errors", () => {
            strictEqual(err, null);
        });

        test("Status code 200", () => {
            strictEqual(prop.statusCode, 200);
        });

        test("Content-length 0", () => {
            strictEqual(prop.headers["content-length"], "0");
        });

	    setImmediate(done);
    }
});
