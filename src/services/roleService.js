// src/services/roleService.js
// AJUSTE O CAMINHO CONFORME A LOCALIZAÇÃO REAL DO SEU authApiClient.js
import { authGet } from './authApiClient';

const roleService = {
    /**
     * Busca uma lista de papéis disponíveis no sistema.
     * Corresponde à rota GET /admin/roles.
     * @returns {Promise<Array<{id: number, name: string, description: string}>>} Lista de papéis.
     */
    async getRoles() {
        try {
            const response = await authGet('/admin/roles'); // Supondo que a rota é /admin/roles
            return response; // Espera-se um array de objetos de papel como: [{id: 1, name: "ADMIN", description: "..."}]
        } catch (error) {
            console.error('Error fetching roles:', error);
            throw error;
        }
    },
};

export default roleService;