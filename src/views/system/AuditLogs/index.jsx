// src/views/system/AuditLogs/index.jsx
import React, { useEffect, useState, useRef } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import FilterAndPaginationBar from '../../../ui-component/FilterAndPaginationBar';
import DataDisplayArea from '../../../ui-component/DataDisplayArea';
import { gridSpacing } from '../../../store/constant';
import auditLogService from '../../../services/auditLogService.js';
import AuditLogItem from "../../../ui-component/audit-logs/AuditLogItem.jsx";

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
    const mainCardRef = useRef(null);
    const [mainCardHeight, setMainCardHeight] = useState('100vh');

    const [logs, setLogs] = useState([]);
    const [totalLogs, setTotalLogs] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);
    const [userIdFilter, setUserIdFilter] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [usernameFilter, setUsernameFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const calculateMainCardHeight = () => {
        if (mainCardRef.current) {
            const rect = mainCardRef.current.getBoundingClientRect();
            // Seu cálculo original, que funcionava, é mantido.
            // O 20px no final é uma pequena margem/padding que seu layout MainLayout pode ter.
            // Ajuste esse 20px se o card não estiver indo até o fim exato da tela.
            const availableHeight = window.innerHeight - rect.top - 20;
            setMainCardHeight(`${Math.max(300, availableHeight)}px`);
        }
    };

    useEffect(() => {
        calculateMainCardHeight();
        window.addEventListener('resize', calculateMainCardHeight);
        const timer = setTimeout(calculateMainCardHeight, 100);

        return () => {
            window.removeEventListener('resize', calculateMainCardHeight);
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
                userName: usernameFilter,
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
    }, [currentPage, itemsPerPage, userIdFilter, actionFilter, statusFilter, usernameFilter]);

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

    const auditLogFilterConfig = [
        {
            name: 'userId',
            label: 'ID do Usuário',
            type: 'text',
            value: userIdFilter,
            onChange: (e) => setUserIdFilter(e.target.value),
            props: { sx: { minWidth: 150 }, size: 'small' }
        },
        {
            name: 'username',
            label: 'Nome de Usuário',
            type: 'text',
            value: usernameFilter,
            onChange: (e) => setUsernameFilter(e.target.value),
            props: { sx: { minWidth: 150 }, size: 'small' }
        },
        {
            name: 'action',
            label: 'Ação',
            type: 'text',
            value: actionFilter,
            onChange: (e) => setActionFilter(e.target.value),
            props: { sx: { minWidth: 150 }, size: 'small' }
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            value: statusFilter,
            onChange: (e) => setStatusFilter(e.target.value),
            options: statusOptions,
            props: { sx: { minWidth: 120 }, size: 'small' }
        }
    ];

    return (
        <MainCard
            ref={mainCardRef}
            content={false}
            sx={{
                height: mainCardHeight, // Usar a altura calculada
                display: 'flex',
                flexDirection: 'column',
                // Nenhuma necessidade de overflow aqui. A rolagem será interna ao DataDisplayArea.
            }}
        >
            {/* Barra de Filtros e Paginação */}
            <FilterAndPaginationBar
                filterConfig={auditLogFilterConfig}
                onApplyFilters={handleFilterChange}
                applyButtonText="Aplicar"
                applyButtonLoading={isLoading}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                totalItems={totalLogs}
                itemsPerPageOptions={itemsPerPageOptions}
                paginationLoading={isLoading}
            />

            {/* Área de Exibição dos Dados (Logs) */}
            <DataDisplayArea
                isLoading={isLoading}
                error={error}
                hasData={logs.length > 0}
                emptyMessage="Nenhum log encontrado com os critérios atuais."
            >
                {/* O conteúdo (logs.map) é passado diretamente como children.
                    O DataDisplayArea se encarregará do padding e rolagem. */}
                {logs.map((log) => (
                    <AuditLogItem key={log.id} log={log} /> // Agora usando o componente modularizado
                ))}
            </DataDisplayArea>
        </MainCard>
    );
}