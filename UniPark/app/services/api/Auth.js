import axios from 'axios';

export async function login (values) {
    const response = await axios.post('http://sddec25-09e.ece.iastate.edu:8080/api/person/login', values);
    return response;
}

export async function logout () {
    const response = await axios.post('http://sddec25-09e.ece.iastate.edu:8080/api/person/logout');
    return response.data;
}

export async function loginAndSaveUser (values) {
    const response = await axios.post('http://sddec25-09e.ece.iastate.edu:8080/api/person/login', values);
    
    return response.data;
}