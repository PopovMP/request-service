"use strict";

const {init, test, done} = require("@popovmp/micro-tester");

const requestService = require("../index.js");

init("Test request-service");

test("Test `post`", () => {
    const url     = "https://httpbin.org/post";
    const form    = {"foo": "bar"};
    const headers = {"Answer": 42};

    requestService.post(url, form, headers,
        requestService_post_ready);

    return true;
});

function requestService_post_ready(err, data, status) {
    if (err) {
        console.error("Error: " + err);
    }

    if (data) {
        const res = JSON.parse(data);
        console.log("res.form.foo: " + res.form.foo);
        console.log("res.headers.Answer: " + res.headers.Answer);
    }

    console.log("Status: " + status);

    done();
}
