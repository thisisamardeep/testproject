import axios from 'axios';
import {Method} from 'axios';

export function CreateRequest(method: Method, url: string) {
    const domain: string = 'https://api.additivasia.io/api/v1/assignment';
    let actionUrl: string = `${domain}/${url}`;
    const request: any = axios({
        method: method,
        url: actionUrl,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });
    return request
}
