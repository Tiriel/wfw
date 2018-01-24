const Server = require('./lib/server');
const Controller = require('./lib/controller');

const MyController = class extends Controller {

    run() {

        return 'I have run!';
    }
};

const MyFailedController = class extends Controller {

    run() {

        throw new Error('eeeeerrrr');
    }
};

const server = new Server();

server.addRoute('/', MyController);
server.addRoute('/e', MyFailedController);

server.start(8080)
    .then(() => {

        console.log(server)
    });
