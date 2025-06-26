// A URL base da sua API local
const API_BASE_URL = "http://localhost:3000/api";

// A sua chave de API
const API_KEY = "e858599469d4087cc299172ef2b427baf51778b86127854ce74cb3a84ec65efb";

export async function client(endpoint, { body, ...customConfig } = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
    };

    const config = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Se a resposta não tiver corpo (ex: status 204), retorne imediatamente.
        if (response.status === 204) {
            return;
        }

        const data = await response.json();

        if (response.ok) {
            return data;
        }

        // <-- AQUI ESTÁ A CORREÇÃO PRINCIPAL
        // Se a resposta não for 'ok', rejeite a promessa com um objeto
        // que contém a mensagem E o status da resposta.
        return Promise.reject({
            message: data?.message || response.statusText,
            status: response.status
        });

    } catch (err) {
        // Trata erros de rede (ex: servidor offline) e retorna um objeto padronizado.
        return Promise.reject({ message: err.message, status: 503 }); // 503: Service Unavailable
    }
}

// O resto das funções não precisa de alteração
export const get = (endpoint, customConfig = {}) => client(endpoint, {...customConfig, method: 'GET'});
export const post = (endpoint, body, customConfig = {}) => client(endpoint, {
    body, ...customConfig,
    method: 'POST'
});
export const put = (endpoint, body, customConfig = {}) => client(endpoint, {body, ...customConfig, method: 'PUT'});
export const del = (endpoint, customConfig = {}) => client(endpoint, {...customConfig, method: 'DELETE'});