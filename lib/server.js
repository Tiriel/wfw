'use strict';
const Http = require('http');

const Transaction = require('./transaction');

const Context = require('./context');

let server;
process.on('uncaughtException', (err) => {

    if (server) {
        const res = server.handleException(err);
        if(!res) {
            throw err;
        }
    }
});

const Server = class {

    constructor() {

        this.routes = new Map(); // TODO...
    }

    log(...args) {

        console.log(...args);
    }

    get context() {

        return Context.getContext();
    }

    get raw() {

        const context = this.context;
        return context.get('raw')
    }

    handleException(err) {

        this.log(err);
        if (!this.raw) {
            return false;
        }

        const response = this.raw.response;

        response.statusCode = 500;
        response.end('Error');
        return true;
    }

    handleNotFound() {

        const response = this.raw.response;
        response.statusCode = 404;
        response.end('Not found');
    }

    addRoute(path, Controller) {

        this.routes.set(path, Controller);
    }

    dispatch(path) {

        return this.routes.get(path);
    }

    handleRequest(request, response) {

        const context = Context.getContext();

        context.set('raw', { request, response });

        const Controller = this.dispatch(request.url);

        if (!Controller) {
            // TODO
            return this.handleNotFound();
        }

        const transaction = new Transaction({ request, response }, new Controller());
        context.set('transaction', transaction);

        return transaction.run();
    }

    start(port) {

        server = this;

        return new Promise((resolve, reject) => {

            // TODO https://nodejs.org/dist/latest-v9.x/docs/api/net.html#net_server_listen
            Http.createServer((req, res) => {

                this.handleRequest(req, res);
            })
                .listen(port, (err) => {

                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                });
        });
    }
};

module.exports = Server;
