const BaseGraphQLError = require('graphql').GraphQLError;

module.exports = class GraphQLError extends BaseGraphQLError {
    constructor(message, code, data) {
        super({
            message: message || 'Unknown error',
            code: code || -1,
            data: data
        });
    }
};
