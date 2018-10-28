module.exports = class GraphqlError extends Error {

    constructor(message, code) {
        super();

        this.message = JSON.stringify({
            message: message || 'Unknown error',
            code: code || -1
        });
    }
};
