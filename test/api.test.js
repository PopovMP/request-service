"use strict"

const assert = require("assert");
const {init, test, ensure} = require("@popovmp/micro-tester");

const request = require("../index.js");

init("Test the Request Service API");

test("It provides method `get`", () => {
    assert.strictEqual(typeof request.get, "function");
});

test("It provides method `post`", () => {
    assert.strictEqual(typeof request.post, "function");
});

test("It provides method `form`", () => {
    assert.strictEqual(typeof request.form, "function");
});

test("It provides method `json`", () => {
    assert.strictEqual(typeof request.json, "function");
});

ensure();
