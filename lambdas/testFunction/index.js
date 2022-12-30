export const handler = async(event) => {
    // TODO implement
    console.log(event);
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify(event),
    };
    return response;
};
