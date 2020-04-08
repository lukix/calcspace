import axios from 'axios';
import { API_URL } from '../config';

const HttpRequest = ({ baseUrl }) => {
  const request = method => (url: string, data?: any) =>
    axios
      .request({
        method,
        url: `${baseUrl}${url}`,
        data,
        withCredentials: true,
      })
      .then(({ data }) => data);

  const httpRequest = {
    get: request('get'),
    post: request('post'),
    put: request('put'),
    delete: request('delete'),
  };

  return httpRequest;
};

export default HttpRequest({ baseUrl: API_URL });
