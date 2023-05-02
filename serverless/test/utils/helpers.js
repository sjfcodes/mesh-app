export const handleAxiosError = (error) => {
  console.log(error.response.data);
  let message = error.body?.message || error.response?.data?.message || error;
  console.error(message);

  // return axios response data from lambda
  return error.body || error.response?.data;
};

export const mockApiGwRequestTransformations = (request) => {
  const mock = { ...request };
  if (request.body) {
    mock.body = JSON.stringify(request.body);
  }

  return mock;
};

export const parseLambdaResponse = (testApi, response) => {
  try {
    if (testApi) return response;
    else return JSON.parse(response.body);
  } catch (error) {
    return response.body;
  }
};
