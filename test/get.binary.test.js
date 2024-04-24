"use strict";

const {ok, strictEqual} = require("assert");
const {test}            = require("node:test");

const request = require("../index.js");
const url     = "https://datafeed.dukascopy.com/datafeed/EURUSD/2020/07/24/07h_ticks.bi5";

test("Test GET binary data", (_, done) => {
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

        test("Received data is Buffer", () => {
            ok(Buffer.isBuffer(data));
        });

        test("Equal data length and Content-Length", () => {
            const contentLength = parseInt(prop.headers["content-length"]);
            strictEqual(data.length, contentLength);
        });

        setImmediate(done);
    }
});
