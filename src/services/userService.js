// src/services/userService.js
// AJUSTE O CAMINHO CONFORME A LOCALIZAÇÃO REAL DO SEU authApiClient.js
import { authGet, authPost, authDel } from './authApiClient';

const userService = {
    /**
     * Busca uma lista de usuários com filtros e paginação.
     * Corresponde à rota GET /admin/users.
     * @param {object} params - Parâmetros de busca.
     * @param {number} [params.page=1] - Número da página.
     * @param {number} [params.limit=10] - Limite de itens por página.
     * @param {string} [params.name] - Filtro por nome do usuário.
     * @param {string} [params.email] - Filtro por email do usuário.
     * @param {string} [params.role] - Filtro por papel do usuário.
     * @returns {Promise<{users: Array, totalCount: number}>} Lista de usuários e total de registros.
     */
    async getUsers({ page = 1, limit = 10, name = '', email = '', role = '' }) {
        const queryParams = new URLSearchParams();
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        if (name) queryParams.append('name', name);
        if (email) queryParams.append('email', email);
        if (role) queryParams.append('role', role);

        try {
            const response = await authGet(`/admin/users?${queryParams.toString()}`);
            return response; // Espera-se { users: [], totalCount: 0 }
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    /**
     * Busca os detalhes de um usuário específico.
     * Corresponde à rota GET /admin/users/:id.
     * @param {string} id - O ID do usuário.
     * @returns {Promise<object>} Os detalhes do usuário.
     */
    async getUserDetails(id) {
        try {
            const response = await authGet(`/admin/users/${id}`);
            return response;
        } catch (error) {
            console.error(`Error fetching user details for ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Cria um novo usuário.
     * Corresponde à rota POST /admin/users.
     * @param {object} userData - Os dados do novo usuário (ex: { name, email, roleName }).
     * @returns {Promise<object>} O usuário criado.
     */
    async createUser(userData) { // Função createUser re-adicionada
        try {
            const response = await authPost('/admin/users', userData);
            return response;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    /**
     * Atribui um papel a um usuário.
     * Corresponde à rota POST /admin/users/:id/roles.
     * @param {string} userId - O ID do usuário.
     * @param {string} roleName - O nome do papel a ser atribuído.
     * @returns {Promise<object>} A resposta da operação.
     */
    async assignRoleToUser(userId, roleName) {
        try {
            const response = await authPost(`/admin/users/${userId}/roles`, { roleName });
            return response;
        } catch (error) {
            console.error(`Error assigning role ${roleName} to user ${userId}:`, error);
            throw error;
        }
    },

    /**
     * Remove um papel de um usuário.
     * Corresponde à rota DELETE /admin/users/:id/roles/:roleId.
     * @param {string} userId - O ID do usuário.
     * @param {string} roleId - O ID do papel a ser removido.
     * @returns {Promise<object>} A resposta da operação.
     */
    async removeRoleFromUser(userId, roleId) {
        try {
            const response = await authDel(`/admin/users/${userId}/roles/${roleId}`);
            return response;
        } catch (error) {
            console.error(`Error removing role ${roleId} from user ${userId}:`, error);
            throw error;
        }
    },

    /**
     * Invalida todas as sessões de um usuário.
     * Corresponde à rota POST /admin/users/:id/logout.
     * @param {string} userId - O ID do usuário.
     * @returns {Promise<object>} A resposta da operação.
     */
    async invalidateUserSession(userId) {
        try {
            const response = await authPost(`/admin/users/${userId}/logout`);
            return response;
        } catch (error) {
            console.error(`Error invalidating sessions for user ${userId}:`, error);
            throw error;
        }
    },
};

export default userService;