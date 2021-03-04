import axios from 'axios';
import { API_URL } from '../config';
import routes from '../shared/routes';
import { getAuthToken } from '../shared/authToken';

const getAuthHeader = () => {
  const token = getAuthToken();
  if (!token) {
    return {};
  }

  return { Authorization: `Bearer ${token}` };
};

const HttpRequest = ({ baseUrl, sendAuthHeader = false, responseErrorHandlers = {} }) => {
  const request = (method) => (url: string, data?: any) => {
    const authHeader = sendAuthHeader ? getAuthHeader() : {};

    return axios
      .request({
        method,
        url: `${baseUrl}${url}`,
        data,
        withCredentials: true,
        headers: { ...authHeader },
      })
      .then(({ data }) => data)
      .catch((error) => {
        if (error.response && responseErrorHandlers[error.response.status]) {
          return responseErrorHandlers[error.response.status](error);
        } else {
          throw error;
        }
      });
  };

  const httpRequest = {
    get: request('get'),
    post: request('post'),
    put: request('put'),
    delete: request('delete'),
  };

  return httpRequest;
};

const forbiddenErrorHandler = () => {
  window.location.replace(routes.home.path);
};

export const httpRequestWithoutRedirect = HttpRequest({ baseUrl: API_URL, sendAuthHeader: true });

export default HttpRequest({
  baseUrl: API_URL,
  sendAuthHeader: true,
  responseErrorHandlers: { 403: forbiddenErrorHandler },
});
