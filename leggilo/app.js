const providerStore = require('./providerStore');

exports.leggiloHandler = async (event, context) => {

    const reqParams = event.queryStringParameters;
    let response = {};

    try {
        if (reqParams.mode === 'providers') {
            response = await providerStore.fetchProviders();
        } else if (reqParams.providerId) {
            response = await providerStore.fetchProviderPosts(reqParams.providerId);
        }
    } catch (err) {
        return err;
    }
    return {
        statusCode: 200, body: JSON.stringify(response), headers: getHeaders(event)
    };
};

function getHeaders(event) {
    const headers = {'Content-Type': 'application/json'};
    const allowedOrigins = process.env.LEGGILO_ALLOWED_ORIGINS.split(',');
    let requestOrigin = event.headers.Origin;
    if (!requestOrigin) {
        requestOrigin = event.headers.origin;
    }
    if (allowedOrigins.indexOf(requestOrigin) !== -1) {
        headers['Access-Control-Allow-Origin'] = requestOrigin;
    }
    return headers;
}
