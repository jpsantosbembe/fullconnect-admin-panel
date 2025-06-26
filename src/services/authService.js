import {post} from './apiClient';
import {authGet} from "./authApiClient.js";

/**
 * Este serviço agrupa todas as chamadas de API relacionadas à autenticação.
 */
const authService = {
    initiateLogin: (email, password) => {
        // 1. Define o endpoint específico da API
        const endpoint = '/sessions/initiate';

        // 2. Prepara o corpo da requisição com os dados do utilizador
        const body = { email, password };

        // 3. Usa a nossa função 'post' centralizada para fazer a chamada
        // A função 'post' já trata do JSON.stringify, headers e da chave da API.
        return post(endpoint, body);
    },

    select2faMethod: (preAuthToken, method) => {
        const endpoint = '/sessions/select-2fa';
        const body = { preAuthToken, method };
        return post(endpoint, body);
    },

    complete2fa: (preAuthToken, method, twoFactorCode) => {
        const endpoint = '/sessions/complete';
        const body = { preAuthToken, method, twoFactorCode };
        return post(endpoint, body);
    },

    getMe: () => {
        const endpoint = '/sessions/me';
        return authGet(endpoint);
    },

};

export default authService;
