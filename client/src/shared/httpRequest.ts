import axios from 'axios';
import { API_URL } from '../config';
import routes from '../shared/routes';

const HttpRequest = ({ baseUrl, responseErrorHandlers = {} }) => {
  const request = (method) => (url: string, data?: any) =>
    axios
      .request({
        method,
        url: `${baseUrl}${url}`,
        data,
        withCredentials: true,
      })
      .then(({ data }) => data)
      .catch((error) => {
        if (error.response && responseErrorHandlers[error.response.status]) {
          return responseErrorHandlers[error.response.status](error);
        } else {
          throw error;
        }
      });

  const httpRequest = {
    get: request('get'),
    post: request('post'),
    put: request('put'),
    delete: request('delete'),
  };

  return httpRequest;
};

const forbiddenErrorHandler = () => {
  window.location.replace(routes.logIn.path);
};

export const httpRequestWithoutRedirect = HttpRequest({ baseUrl: API_URL });

export default HttpRequest({
  baseUrl: API_URL,
  responseErrorHandlers: { 403: forbiddenErrorHandler },
});
