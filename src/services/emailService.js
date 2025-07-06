// src/services/emailService.js
import { authGet, authPost, authPut } from './authApiClient';

const emailService = {
    /**
     * Busca uma lista de modelos de e-mail com filtros e paginação.
     * Corresponde à rota GET /admin/email-templates.
     * @param {object} params - Parâmetros de busca.
     * @param {number} [params.page=1] - Número da página.
     * @param {number} [params.limit=10] - Limite de itens por página.
     * @param {string} [params.name] - Filtro por nome do modelo.
     * @param {string} [params.slug] - Filtro por slug do modelo.
     * @param {string} [params.status] - Filtro por status do modelo (ex: 'PUBLISHED', 'DRAFT').
     * @returns {Promise<{templates: Array, totalCount: number}>} Lista de modelos de e-mail e total de registros.
     */
    async getEmailTemplates({ page = 1, limit = 10, name = '', slug = '', status = '' } = {}) {
        const queryParams = new URLSearchParams();
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        if (name) queryParams.append('name', name);
        if (slug) queryParams.append('slug', slug);
        if (status) queryParams.append('status', status);

        try {
            const response = await authGet(`/admin/email-templates?${queryParams.toString()}`);
            return response; // Espera-se { templates: [], totalCount: 0 }
        } catch (error) {
            console.error('Error fetching email templates:', error);
            throw error;
        }
    },

    /**
     * Busca um modelo de e-mail pelo ID.
     * Corresponde à rota GET /admin/email-templates/:id.
     * @param {number|string} id - ID do modelo de e-mail.
     * @returns {Promise<Object>} Modelo de e-mail encontrado.
     */
    async getEmailTemplateById(id) {
        try {
            const response = await authGet(`/admin/email-templates/${id}`);
            return response;
        } catch (error) {
            console.error(`Error fetching email template with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Cria um novo modelo de e-mail.
     * Corresponde à rota POST /admin/email-templates.
     * @param {Object} templateData - Dados do novo modelo.
     * @param {string} templateData.name - Nome do modelo.
     * @param {string} templateData.slug - Slug do modelo.
     * @param {string} templateData.subject - Assunto do e-mail.
     * @param {string} templateData.body_html - Conteúdo HTML do e-mail.
     * @param {string} templateData.status - Status do modelo (DRAFT ou PUBLISHED).
     * @returns {Promise<Object>} Modelo criado.
     */
    async createEmailTemplate(templateData) {
        try {
            const response = await authPost('/admin/email-templates', templateData);
            return response;
        } catch (error) {
            console.error('Error creating email template:', error);
            throw error;
        }
    },

    /**
     * Atualiza um modelo de e-mail existente.
     * Corresponde à rota PUT /admin/email-templates/:id.
     * @param {number|string} id - ID do modelo.
     * @param {Object} templateData - Dados atualizados do modelo.
     * @returns {Promise<Object>} Modelo atualizado.
     */
    async updateEmailTemplate(id, templateData) {
        try {
            const response = await authPut(`/admin/email-templates/${id}`, templateData);
            return response;
        } catch (error) {
            console.error(`Error updating email template with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Exclui um modelo de e-mail.
     * Corresponde à rota DELETE /admin/email-templates/:id.
     * @param {number|string} id - ID do modelo.
     * @returns {Promise<Object>} Resposta da API.
     */
    async deleteEmailTemplate(id) {
        try {
            const response = await authDelete(`/admin/email-templates/${id}`);
            return response;
        } catch (error) {
            console.error(`Error deleting email template with ID ${id}:`, error);
            throw error;
        }
    }
};

export default emailService;