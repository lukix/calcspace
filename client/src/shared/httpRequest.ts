import axios from 'axios';
import config from '../config';

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

export default HttpRequest({ baseUrl: config.API_URL });
