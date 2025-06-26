// src/views/system/AuditLogs/index.jsx
import React, { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import { gridSpacing } from '../../../store/constant';
import auditLogService from '../../../services/auditLogService.js';

const itemsPerPageOptions = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
];

const statusOptions = [
    { value: '', label: 'All' },
    { value: 'SUCCESS', label: 'SUCCESS' },
    { value: 'FAILURE', label: 'FAILURE' },
];

export default function AuditLogsPage() {
    const [logs, setLogs] = useState([]);
    const [totalLogs, setTotalLogs] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50); // Default to 50 items per page
    const [userIdFilter, setUserIdFilter] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAuditLogs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await auditLogService.getAuditLogs({
                page: currentPage,
                limit: itemsPerPage,
                userId: userIdFilter,
                action: actionFilter,
                status: statusFilter,
            });
            setLogs(data); // Assuming the API returns the array directly
            // In a real API, totalLogs would come from a header or a 'total' field in the response object
            // For now, we'll assume a dummy total for pagination to work.
            // A more robust solution would involve the API returning total count.
            setTotalLogs(200); // Placeholder: Set a dummy total for pagination example
        } catch (err) {
            console.error("Failed to fetch audit logs:", err);
            setError(err.message || 'Failed to fetch audit logs.');
            setLogs([]);
            setTotalLogs(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAuditLogs();
    }, [currentPage, itemsPerPage, userIdFilter, actionFilter, statusFilter]); // Re-fetch on param changes

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1); // Reset to first page when items per page changes
    };

    const handleFilterChange = () => {
        setCurrentPage(1); // Reset to first page on filter change
    };

    return (
        <MainCard title="Logs de Auditoria">
            <Grid container spacing={gridSpacing}>
                {/* Filters Section */}
                <Grid item xs={12}>
                    <Grid container spacing={gridSpacing} alignItems="center">
                        <Grid item xs={12} sm={4} md={3}>
                            <TextField
                                label="ID do Usuário"
                                value={userIdFilter}
                                onChange={(e) => setUserIdFilter(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={3}>
                            <TextField
                                label="Ação"
                                value={actionFilter}
                                onChange={(e) => setActionFilter(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={3}>
                            <TextField
                                select
                                label="Status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                fullWidth
                            >
                                {statusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                            <Button variant="contained" color="secondary" onClick={handleFilterChange} disabled={isLoading}>
                                Aplicar Filtros
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Loading/Error State */}
                <Grid item xs={12}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }} >
                            <CircularProgress />
                            <Typography variant="subtitle1" sx={{ ml: 2 }}>Carregando logs...</Typography>
                        </Box>
                    ) : error ? (
                        <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>
                            Erro: {error}
                        </Typography>
                    ) : logs.length === 0 ? (
                        <Typography variant="subtitle1" sx={{ mt: 4, textAlign: 'center' }}>
                            Nenhum log encontrado com os critérios atuais.
                        </Typography>
                    ) : (
                        /* Audit Logs Display */
                        <Box sx={{ mt: 2 }}>
                            {logs.map((log) => (
                                <Paper key={log.id} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider' }}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2"><strong>ID:</strong> {log.id}</Typography>
                                            <Typography variant="body2"><strong>Usuário ID:</strong> {log.user_id}</Typography>
                                            <Typography variant="body2"><strong>Ação:</strong> {log.action}</Typography>
                                            <Typography variant="body2"><strong>Status:</strong> {log.status}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2"><strong>Tipo Alvo:</strong> {log.target_type || 'N/A'}</Typography>
                                            <Typography variant="body2"><strong>ID Alvo:</strong> {log.target_id || 'N/A'}</Typography>
                                            <Typography variant="body2"><strong>IP:</strong> {log.ip_address}</Typography>
                                            <Typography variant="body2"><strong>Criado em:</strong> {new Date(log.created_at).toLocaleString()}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2">
                                                <strong>Detalhes:</strong>
                                                {(() => {
                                                    try {
                                                        // Ensure log.details is a string before parsing
                                                        if (typeof log.details === 'object' && log.details !== null) {
                                                            return JSON.stringify(log.details, null, 2);
                                                        }
                                                        const parsedDetails = JSON.parse(log.details);
                                                        return JSON.stringify(parsedDetails, null, 2);
                                                    } catch (e) {
                                                        // If parsing fails, ensure it's converted to a string for display
                                                        return typeof log.details === 'string' ? log.details : String(log.details);
                                                    }
                                                })()}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}
                        </Box>
                    )}
                </Grid>

                {/* Pagination Controls */}
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <TextField
                            select
                            label="Itens por página"
                            value={itemsPerPage}
                            onChange={(e) => handleItemsPerPageChange(e)}
                            sx={{ width: 120 }}
                            size="small"
                        >
                            {itemsPerPageOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Pagination
                            count={Math.ceil(totalLogs / itemsPerPage)}
                            page={currentPage}
                            onChange={(e, v) => handlePageChange(e, v)}
                            color="primary"
                            disabled={isLoading}
                        />
                    </Stack>
                </Grid>
            </Grid>
        </MainCard>
    );
}