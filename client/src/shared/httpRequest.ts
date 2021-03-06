import axios from 'axios';
import { API_URL, RENEW_TOKEN_URL } from '../config';
import routes from '../shared/routes';
import {
  hasValidAuthToken,
  hasValidRefreshToken,
  setAuthToken,
  getAuthToken,
  getRefreshToken,
} from './authTokens';

const getAuthHeader = async () => {
  if (hasValidAuthToken()) {
    return { Authorization: `Bearer ${getAuthToken()}` };
  }
  if (hasValidRefreshToken()) {
    const refreshToken = getRefreshToken();
    try {
      const {
        data: { token, expirationTime },
      } = await axios.request({
        method: 'post',
        url: RENEW_TOKEN_URL,
        data: { refreshToken },
        withCredentials: true,
      });
      setAuthToken(token, expirationTime);
      return { Authorization: `Bearer ${token}` };
    } catch (error) {
      console.error('Renewing auth token failed');
      console.error(error);
      return {};
    }
  }

  return {};
};

const HttpRequest = ({ baseUrl, sendAuthHeader = false, responseErrorHandlers = {} }) => {
  const request = (method) => async (url: string, data?: any) => {
    const authHeader = sendAuthHeader ? await getAuthHeader() : {};

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
