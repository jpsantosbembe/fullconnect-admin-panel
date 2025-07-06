// src/services/auditLogService.js
import { authGet } from './authApiClient';

// Define the endpoint as a relative path, consistent with authService.js
const AUDIT_LOGS_ENDPOINT = '/admin/audit-logs';

const auditLogService = {
    /**
     * Fetches audit logs from the API.
     * @param {{ page?: number, limit?: number, userId?: string, action?: string, status?: 'SUCCESS' | 'FAILURE', userName?: string }} params
     * @returns {{ id: number, user_id: number, action: string, status: string, target_type: string | null, target_id: number | null, details: string, ip_address: string, created_at: string }[]}
     */
    getAuditLogs: async (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.userId) queryParams.append('userId', params.userId);
        if (params.action) queryParams.append('action', params.action);
        if (params.status) queryParams.append('status', params.status);
        if (params.userName) queryParams.append('userName', params.userName);

        // Construct the full URL with query parameters
        // The authGet function (via authClient and client) will prepend the API_BASE_URL
        const url = `${AUDIT_LOGS_ENDPOINT}?${queryParams.toString()}`;
        return authGet(url);
    },
};

export default auditLogService;