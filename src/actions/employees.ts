import {CreateRequest} from './requestCreator';
import {EmployeeName} from "../types/types";
import {AxiosError, AxiosResponse} from "axios";

export function GetDirectSubordinates(employeeName: EmployeeName, callback: (success: boolean, resp: AxiosResponse) => void): void {
    const request: any = CreateRequest('GET', `employees/${employeeName}`);
    request.then((response: AxiosResponse) => {
        callback(true, response)
    })
        .catch((error: AxiosError) => {
        })
}


export function GetAllEmployees(callback: (success: boolean, resp: AxiosResponse) => void) {
    const request: any = CreateRequest('GET', `employees/`);
    request.then((response: AxiosResponse) => {
        callback(true, response)
    }).catch((error: AxiosError) => {
    })
}




