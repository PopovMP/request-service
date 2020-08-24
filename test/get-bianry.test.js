"use strict";

const assert = require("assert");
const {init, test, ensure} = require("@popovmp/micro-tester");

const requestService = require("../index.js");

init("Run get-binary.test.js");

test("Test `get`", () => {
    const hostname = "datafeed.dukascopy.com";
    const path     = "/datafeed/EURUSD/2020/07/24/07h_ticks.bi5";
    const headers  = {};

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

    test("Received data is Buffer", () => {
        assert.ok(Buffer.isBuffer(data));
    });

    test("Correct buffer length", () => {
        assert.strictEqual(data.length, 35463);
    });

    test("Status 200", () => {
        assert.strictEqual(status, 200);
    });

    ensure();
}
