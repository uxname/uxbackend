const BaseGraphQLError = require('graphql').GraphQLError;

module.exports = class GQLError extends BaseGraphQLError {
    /**
     * Create new GQLError
     * @param params:
     * message, code, data, internalData
     * @param params.internalData The internalData property is meant for data you want to store on the error
     * object (e.g. for logging), but not send out to your end users. You can utilize this data for logging purposes.
     */
    constructor(params) {
        const {message, code, data, internalData} = params;
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
