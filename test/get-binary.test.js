"use strict";

const assert = require("assert");
const {init, test, ensure} = require("@popovmp/micro-tester");

const request = require("../index.js");
const headers  = {};

const url = "https://datafeed.dukascopy.com/datafeed/EURUSD/2020/07/24/07h_ticks.bi5";

request.get(url, headers,
    requestService_get_ready);

// noinspection DuplicatedCode
function requestService_get_ready(err, data) {
    init("Run get-binary.test.js");

    test("No errors", () => {
        assert.ok(!err);
    });

    test("Response received", () => {
        assert.ok(data);
    });

    test("Received data is Buffer", () => {
        assert.ok(Buffer.isBuffer(data));
    });

    test("Correct buffer length", () => {
        assert.strictEqual(data.length, 35463);
    });

    ensure();
}
