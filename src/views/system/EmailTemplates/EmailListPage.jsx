import React, { useEffect, useState, useRef } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import FilterAndPaginationBar from '../../../ui-component/FilterAndPaginationBar';
import DataDisplayArea from '../../../ui-component/DataDisplayArea';
import emailService from '../../../services/emailService.js'; // Importa o serviço de modelos de e-mail
import EmailItem from '../../../ui-component/email-templates/EmailItem.jsx'; // Importa o componente EmailItem

const itemsPerPageOptions = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
];

const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'PUBLISHED', label: 'Publicado' },
    { value: 'DRAFT', label: 'Rascunho' },
    // Adicione outros status se existirem na sua API
];

export default function EmailListPage() {
    const theme = useTheme();
    const mainCardRef = useRef(null);
    const [mainCardHeight, setMainCardHeight] = useState('100vh');

    const [templates, setTemplates] = useState([]);
    const [totalTemplates, setTotalTemplates] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);
    const [nameFilter, setNameFilter] = useState('');
    const [slugFilter, setSlugFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const calculateMainCardHeight = () => {
        if (mainCardRef.current) {
            const rect = mainCardRef.current.getBoundingClientRect();
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

    const fetchEmailTemplates = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { templates: fetchedTemplates, totalCount } = await emailService.getEmailTemplates({
                page: currentPage,
                limit: itemsPerPage,
                name: nameFilter,
                slug: slugFilter,
                status: statusFilter,
            });
            setTemplates(fetchedTemplates);
            setTotalTemplates(totalCount);
        } catch (err) {
            console.error("Failed to fetch email templates:", err);
            setError(err.message || 'Falha ao carregar modelos de e-mail.');
            setTemplates([]);
            setTotalTemplates(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmailTemplates();
    }, [currentPage, itemsPerPage, nameFilter, slugFilter, statusFilter]);

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

    const emailTemplateFilterConfig = [
        {
            name: 'name',
            label: 'Nome do Modelo',
            type: 'text',
            value: nameFilter,
            onChange: (e) => setNameFilter(e.target.value),
            props: { sx: { minWidth: 180 }, size: 'small' }
        },
        {
            name: 'slug',
            label: 'Slug',
            type: 'text',
            value: slugFilter,
            onChange: (e) => setSlugFilter(e.target.value),
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
                height: mainCardHeight,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Barra de Filtros e Paginação */}
            <FilterAndPaginationBar
                filterConfig={emailTemplateFilterConfig}
                onApplyFilters={handleFilterChange}
                applyButtonText="Aplicar Filtros"
                applyButtonLoading={isLoading}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                totalItems={totalTemplates}
                itemsPerPageOptions={itemsPerPageOptions}
                paginationLoading={isLoading}
            />

            {/* Área de Exibição dos Dados (Modelos de E-mail) */}
            <DataDisplayArea
                isLoading={isLoading}
                error={error}
                hasData={templates.length > 0}
                emptyMessage="Nenhum modelo de e-mail encontrado com os critérios atuais."
            >
                {templates.map((template) => (
                    <EmailItem key={template.id} template={template} />
                ))}
            </DataDisplayArea>
        </MainCard>
    );
}