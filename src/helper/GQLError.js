const BaseGraphQLError = require('graphql').GraphQLError;

module.exports = class GQLError extends BaseGraphQLError {
    /**
     * Create GQLError
     * @param message
     * @param code
     * @param data
     * @param internalData The internalData property is meant for data you want to store on the error
     * object (e.g. for logging), but not send out to your end users. You can utilize this data for logging purposes.
     */
    constructor({message, code, data, internalData}) {
        super({
            message: message || 'Unknown error',
            code: code || -1,
            data: data,
            internalError: internalData,
            IS_GQLERROR: true // to check is GQLError in formatError
        });
    }

    static formatError(error) {
        if (error.message.IS_GQLERROR) {
            return {
                message: error.message.message,
                code: error.message.code,
                data: error.message.data
            }
        } else {
            return error;
        }
    }
};
