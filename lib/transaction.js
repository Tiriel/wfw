'use strict';
const UUIDv4 = require('uuid/v4');

const Request = require('./request');
const Response = require('./response');

module.exports = class {

    constructor(raw, controller) {

        this.id = UUIDv4();
        this.request = new Request(raw.request);
        this.response = new Response(raw.response);

        this.raw = raw;

        this.controller = controller;
    }

    run() {

        this.raw.response.write(this.controller.run());
        return this.close();
    }

    close() {

        return this.response.end();
    }
};
