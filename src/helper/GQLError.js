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
            internalError: internalData
        });
    }

    static formatError(error) {
        if (error instanceof BaseGraphQLError || error instanceof GQLError) {
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
