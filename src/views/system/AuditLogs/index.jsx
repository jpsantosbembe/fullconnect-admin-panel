// src/views/system/AuditLogs/index.jsx
import React, { useEffect, useState, useRef } from 'react';

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
import { useTheme } from '@mui/material/styles';

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
    const theme = useTheme();
    const containerRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState('100vh');

    const [logs, setLogs] = useState([]);
    const [totalLogs, setTotalLogs] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);
    const [userIdFilter, setUserIdFilter] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Função para calcular altura dinâmica
    const calculateHeight = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const availableHeight = window.innerHeight - rect.top - 20; // 20px de margem
            setContainerHeight(`${Math.max(300, availableHeight)}px`);
        }
    };

    useEffect(() => {
        // Calcular altura inicial
        calculateHeight();

        // Recalcular ao redimensionar janela
        const handleResize = () => calculateHeight();
        window.addEventListener('resize', handleResize);

        // Recalcular após um pequeno delay para garantir que o DOM esteja pronto
        const timer = setTimeout(calculateHeight, 100);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, []);

    const fetchAuditLogs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { logs: fetchedLogs, totalCount } = await auditLogService.getAuditLogs({
                page: currentPage,
                limit: itemsPerPage,
                userId: userIdFilter,
                action: actionFilter,
                status: statusFilter,
            });
            setLogs(fetchedLogs);
            setTotalLogs(totalCount);
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
    }, [currentPage, itemsPerPage, userIdFilter, actionFilter, statusFilter]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleFilterChange = () => {
        setCurrentPage(1);
    };

    return (
        <div ref={containerRef}>
            <MainCard
                content={false}
                sx={{
                    height: containerHeight,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
            >
                {/* Contêiner para os filtros fixo */}
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        flexShrink: 0,
                        backgroundColor: theme.palette.background.default,
                        padding: theme.spacing(2),
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.shadows[1]
                    }}
                >
                    {/* Container com flexbox para alinhar à direita */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: theme.spacing(2),
                        flexWrap: { xs: 'wrap', md: 'nowrap' }
                    }}>
                        {/* Filtros - lado esquerdo */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: theme.spacing(2),
                            flexWrap: { xs: 'wrap', md: 'nowrap' },
                            flex: '0 0 auto'
                        }}>
                            <TextField
                                label="ID do Usuário"
                                value={userIdFilter}
                                onChange={(e) => setUserIdFilter(e.target.value)}
                                sx={{ minWidth: 150 }}
                                size="small"
                            />
                            <TextField
                                label="Ação"
                                value={actionFilter}
                                onChange={(e) => setActionFilter(e.target.value)}
                                sx={{ minWidth: 150 }}
                                size="small"
                            />
                            <TextField
                                select
                                label="Status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                sx={{ minWidth: 120 }}
                                size="small"
                            >
                                {statusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleFilterChange}
                                disabled={isLoading}
                                size="small"
                            >
                                Aplicar
                            </Button>
                        </Box>

                        {/* Controles de Paginação - completamente à direita */}
                        {!isLoading && !error && logs.length > 0 && (
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: theme.spacing(1),
                                flexWrap: 'nowrap',
                                flex: '0 0 auto'
                            }}>
                                <TextField
                                    select
                                    label="Por página"
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPageChange}
                                    sx={{ minWidth: 100 }}
                                    size="small"
                                >
                                    {itemsPerPageOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                    {totalLogs} registros
                                </Typography>

                                <Pagination
                                    count={Math.ceil(totalLogs / itemsPerPage)}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                    disabled={isLoading}
                                    size="small"
                                />
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Seção Principal de Conteúdo */}
                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0, // Importante para o flex funcionar corretamente
                        overflowY: 'auto',
                        padding: theme.spacing(2)
                    }}
                >
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                            <CircularProgress />
                            <Typography variant="subtitle1" sx={{ ml: 2 }}>Carregando logs...</Typography>
                        </Box>
                    ) : error ? (
                        <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>
                            Erro: {error}
                        </Typography>
                    ) : logs.length === 0 ? (
                        <Paper sx={{ p: 3, mt: 2, textAlign: 'center' }}>
                            <Typography variant="subtitle1" color="text.secondary">
                                Nenhum log encontrado com os critérios atuais.
                            </Typography>
                        </Paper>
                    ) : (
                        <Box sx={{ mt: 1 }}>
                            {logs.map((log) => (
                                <Paper key={log.id} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider' }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2"><strong>ID:</strong> {log.id}</Typography>
                                            <Typography variant="body2"><strong>Usuário ID:</strong> {log.user_id}</Typography>
                                            <Typography variant="body2"><strong>Ação:</strong> {log.action}</Typography>
                                            <Typography variant="body2"><strong>Status:</strong>
                                                <Box component="span" sx={{
                                                    ml: 1,
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    fontSize: '0.75rem',
                                                    backgroundColor: log.status === 'SUCCESS' ? 'success.light' : 'error.light',
                                                    color: log.status === 'SUCCESS' ? 'success.contrastText' : 'error.contrastText'
                                                }}>
                                                    {log.status}
                                                </Box>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2"><strong>Tipo Alvo:</strong> {log.target_type || 'N/A'}</Typography>
                                            <Typography variant="body2"><strong>ID Alvo:</strong> {log.target_id || 'N/A'}</Typography>
                                            <Typography variant="body2"><strong>IP:</strong> {log.ip_address}</Typography>
                                            <Typography variant="body2"><strong>Criado em:</strong> {new Date(log.created_at).toLocaleString()}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Detalhes:</strong>
                                            </Typography>
                                            <Box sx={{
                                                p: 1,
                                                backgroundColor: theme.palette.grey[50],
                                                borderRadius: 1,
                                                maxHeight: 200,
                                                overflowY: 'auto'
                                            }}>
                                                <Typography variant="body2" component="pre" sx={{
                                                    whiteSpace: 'pre-wrap',
                                                    fontFamily: 'monospace',
                                                    fontSize: '0.8rem'
                                                }}>
                                                    {(() => {
                                                        try {
                                                            if (typeof log.details === 'object' && log.details !== null) {
                                                                return JSON.stringify(log.details, null, 2);
                                                            }
                                                            const parsedDetails = JSON.parse(log.details);
                                                            return JSON.stringify(parsedDetails, null, 2);
                                                        } catch (e) {
                                                            return typeof log.details === 'string' ? log.details : String(log.details);
                                                        }
                                                    })()}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}
                        </Box>
                    )}
                </Box>
            </MainCard>
        </div>
    );
}