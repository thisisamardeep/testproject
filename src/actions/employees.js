import {CreateRequest} from './requestCreator';

export function GetDirectSubordinates(employeeName, callback = null) {
    const request = CreateRequest('GET', `employees/${employeeName}`)
    return request.then((response) => {
        return callback(true, response)
    })
        .catch((error) => {
        })
}


export function GetAllEmployees(callback = null) {
    const request = CreateRequest('GET', `employees/`);
    return request.then((response) => {
        return callback(true, response)
    }).catch((error) => {
    })
}




