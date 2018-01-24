'use strict';

module.exports = class {

    constructor(raw) {

        this.raw = raw;
    }

    end() {

        return new Promise((resolve, reject) => {

            this.raw.end((err) => {

                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }
};
