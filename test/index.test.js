"use strict"

const assert = require("assert");
const {init, test, ensure} = require("@popovmp/micro-tester");

const requestService = require("../index.js");

init("Test request-service");

test("It provides method `post`", () => {
    assert.strictEqual(typeof requestService.post, "function");
});

test("It provides method `get`", () => {
    assert.strictEqual(typeof requestService.get, "function");
});

ensure();
