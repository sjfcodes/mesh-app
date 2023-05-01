export const handleAxiosError = (error) => {
  console.log(error.response.data);
  let message = error.response.data.message || error.message || error;
  console.error(message);

  // return axios response data from lambda
  return error.response.data;
};
