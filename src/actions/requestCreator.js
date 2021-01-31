import axios from 'axios';

export function CreateRequest(method, url) {
  const domain = 'https://api.additivasia.io/api/v1/assignment';
  let actionUrl = `${domain}/${url}`;
  const request = axios({
    method: method,
    url: actionUrl,
    headers: {
      'Content-Type' : 'application/json',
      'Accept'       : 'application/json',
    }
  });
  return request
}