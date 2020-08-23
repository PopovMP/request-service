"use strict"

const {init, test, done} = require("@popovmp/micro-tester");

const requestService = require("../index.js");

init("Test request-service");

test("It provides method `post`", () => 
    typeof requestService.post === "function"
);

test("It provides method `get`", () => 
    typeof requestService.get === "function"
);

done();
