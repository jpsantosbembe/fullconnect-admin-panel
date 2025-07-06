import React, { useEffect, useState, useRef } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import FilterAndPaginationBar from '../../../ui-component/FilterAndPaginationBar';
import DataDisplayArea from '../../../ui-component/DataDisplayArea';
// Não precisamos do gridSpacing aqui, pois DataDisplayArea já gerencia o layout interno.
// import { gridSpacing } from '../../../store/constant';
import userService from '../../../services/userService'; // Importa o serviço de usuários
import UserItem from '../../../ui-component/user-management/UserItem'; // Importa o componente UserItem

const itemsPerPageOptions = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
];

const roleOptions = [
    { value: '', label: 'Todos' },
    // Adicione os papéis que você espera filtrar aqui, por exemplo:
    { value: 'ADMIN', label: 'Admin' },
    { value: 'USER', label: 'Usuário Padrão' },
    // Você pode buscar esses papéis da API se tiver um endpoint para isso.
];

export default function UserListPage() {
    const theme = useTheme();
    const mainCardRef = useRef(null);
    const [mainCardHeight, setMainCardHeight] = useState('100vh'); // Altura inicial padrão

    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);
    const [nameFilter, setNameFilter] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const calculateMainCardHeight = () => {
        if (mainCardRef.current) {
            const rect = mainCardRef.current.getBoundingClientRect();
            const availableHeight = window.innerHeight - rect.top - 20; // Ajuste a margem inferior conforme seu layout
            setMainCardHeight(`${Math.max(300, availableHeight)}px`);
        }
    };

    useEffect(() => {
        calculateMainCardHeight();
        window.addEventListener('resize', calculateMainCardHeight);
        const timer = setTimeout(calculateMainCardHeight, 100); // Pequeno atraso para garantir o cálculo correto

        return () => {
            window.removeEventListener('resize', calculateMainCardHeight);
            clearTimeout(timer);
        };
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { users: fetchedUsers, totalCount } = await userService.getUsers({
                page: currentPage,
                limit: itemsPerPage,
                name: nameFilter,
                email: emailFilter,
                role: roleFilter,
            });
            setUsers(fetchedUsers);
            setTotalUsers(totalCount);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError(err.message || 'Falha ao carregar usuários.');
            setUsers([]);
            setTotalUsers(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, itemsPerPage, nameFilter, emailFilter, roleFilter]); // Recarrega ao mudar filtros ou paginação

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1); // Volta para a primeira página ao mudar o limite
    };

    const handleFilterChange = () => {
        setCurrentPage(1); // Volta para a primeira página ao aplicar novos filtros
    };

    const userFilterConfig = [
        {
            name: 'name',
            label: 'Nome',
            type: 'text',
            value: nameFilter,
            onChange: (e) => setNameFilter(e.target.value),
            props: { sx: { minWidth: 150 }, size: 'small' }
        },
        {
            name: 'email',
            label: 'Email',
            type: 'text',
            value: emailFilter,
            onChange: (e) => setEmailFilter(e.target.value),
            props: { sx: { minWidth: 150 }, size: 'small' }
        },
        {
            name: 'role',
            label: 'Papel',
            type: 'select',
            value: roleFilter,
            onChange: (e) => setRoleFilter(e.target.value),
            options: roleOptions,
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
                filterConfig={userFilterConfig}
                onApplyFilters={handleFilterChange}
                applyButtonText="Aplicar Filtros"
                applyButtonLoading={isLoading}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                totalItems={totalUsers}
                itemsPerPageOptions={itemsPerPageOptions}
                paginationLoading={isLoading}
            />

            {/* Área de Exibição dos Dados (Usuários) */}
            <DataDisplayArea
                isLoading={isLoading}
                error={error}
                hasData={users.length > 0}
                emptyMessage="Nenhum usuário encontrado com os critérios atuais."
            >
                {users.map((user) => (
                    <UserItem key={user.id} user={user} /> // Usando o componente UserItem
                ))}
            </DataDisplayArea>
        </MainCard>
    );
}