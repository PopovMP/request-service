"use strict";

const {ok, strictEqual} = require("assert");
const {test}            = require("node:test");

const request = require("../index.js");

test("Test POST form data", (_, done) => {
    const url     = "https://httpbin.org/post?foo=bar";
    const form    = {number: 42, text: "foo", list: [1, 2]};
    const headers = {Client: "request-service"};

    request.form(url, form, headers, requestService_ready);

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

        test("Correct header", () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.headers.Client, "request-service");
        });

        test("Correct data - number (as string)", () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.form.number, "42");
        });

        test("Correct data - text", () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.form.text, "foo");
        });

        test("Lists are ignored", () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.form.list, undefined);
        });

        setImmediate(done);
    }
});
