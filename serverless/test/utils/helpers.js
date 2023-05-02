export const handleAxiosError = (error) => {
  console.log(error.response.data);
  let message = error.body?.message || error.response?.data?.body?.message || error;
  console.error(message);

  // return axios response data from lambda
  return error.body || error.response?.data;
};
