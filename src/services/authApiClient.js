import { client, post } from './apiClient';
import tokenService from './tokenService';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

async function authClient(endpoint, { body, ...customConfig } = {}) {
    const accessToken = tokenService.getAccessToken();
    const authHeaders = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    const config = {
        body,
        ...customConfig,
        headers: {
            ...authHeaders,
            ...customConfig.headers,
        },
    };

    try {
        return await client(endpoint, config);
    } catch (error) {
        if (error.status !== 401 || endpoint.includes('/sessions/refresh')) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(token => {
                config.headers.Authorization = `Bearer ${token}`;
                return client(endpoint, config);
            });
        }

        isRefreshing = true;
        const refreshToken = tokenService.getRefreshToken(); // <-- USA O SERVICE

        if (!refreshToken) {
            isRefreshing = false;
            tokenService.clearTokens(); // <-- USA O SERVICE
            // Redirecionar para login aqui, se desejado
            return Promise.reject(new Error("Sessão expirada."));
        }

        try {
            const newTokens = await post('/sessions/refresh', { refreshToken });

            tokenService.setTokens(newTokens);
            processQueue(null, newTokens.accessToken);

            config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return client(endpoint, config);
        } catch (refreshError) {
            processQueue(refreshError, null);
            tokenService.clearTokens();
            // Redirecionar para login aqui
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
}

// Funções para requisições AUTENTICADAS
export const authGet = (endpoint, customConfig = {}) => authClient(endpoint, { ...customConfig, method: 'GET' });
export const authPost = (endpoint, body, customConfig = {}) => authClient(endpoint, { body, ...customConfig, method: 'POST' });
export const authPut = (endpoint, body, customConfig = {}) => authClient(endpoint, { body, ...customConfig, method: 'PUT' });
export const authDel = (endpoint, customConfig = {}) => authClient(endpoint, { ...customConfig, method: 'DELETE' });