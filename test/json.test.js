"use strict";

const {ok, strictEqual, deepStrictEqual} = require("assert");
const {test}                             = require("node:test");

const request = require("../index.js");

test("Test POST json data", (_, done) => {
    const url     = "https://httpbin.org/post?foo=bar";
    const json    = {number: 42, text: "foo", list: [1, 2], object: {bar: "baz"}};
    const headers = {"Client": "request-service"};

    request.json(url, json, headers, request_json_ready);

    /**
     * @type { ResponseCallback }
     *
     * @param { null | string } err
     * @param { Buffer | Object | string | null } data
     * @param { RequestProperties } [prop]
     */
    function request_json_ready(err, data, prop) {
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

        test("Correct header", () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.headers.Client, "request-service");
        });

        test("Correct data - number", () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.json.number, 42);
        });

        test("Correct data - text", () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.json.text, "foo");
        });

        test("Correct data - list", () => {
            // noinspection JSUnresolvedVariable
            deepStrictEqual(data.json.list, [1, 2]);
        });

        test("Correct data - object", () => {
            // noinspection JSUnresolvedVariable
            deepStrictEqual(data.json.object, {bar: "baz"});
        });

        setImmediate(done);
    }
});
