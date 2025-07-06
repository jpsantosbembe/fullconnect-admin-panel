import React, { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// icons
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmailIcon from '@mui/icons-material/Email';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

// componentes locais
import UserViewModal from './UserViewModal';
import UserEditModal from './UserEditModal';

// Dicionário de roles para exibição mais amigável
const ROLE_DICTIONARY = {
    ADMIN: 'Administrador',
    MANAGER: 'Gerente',
    USER: 'Usuário',
    CLIENT: 'Cliente',
    GUEST: 'Convidado'
};

/**
 * Componente de visualização de um usuário individual
 */
const UserItem = ({ user }) => {
    const theme = useTheme();
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    // Manipuladores para abrir e fechar os modais
    const handleViewOpen = () => setViewModalOpen(true);
    const handleViewClose = () => setViewModalOpen(false);
    const handleEditOpen = () => setEditModalOpen(true);
    const handleEditClose = () => setEditModalOpen(false);

    // Formatação da data
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleString();
        } catch (e) {
            return dateStr;
        }
    };

    // Obter ícone para a role
    const getRoleIcon = (role) => {
        switch (role) {
            case 'ADMIN':
                return AdminPanelSettingsIcon;
            case 'MANAGER':
                return SupervisorAccountIcon;
            default:
                return PersonIcon;
        }
    };

    // Obter configuração de cor para a role
    const getRoleConfig = (role) => {
        switch (role) {
            case 'ADMIN':
                return {
                    color: theme.palette.primary.main,
                    bgColor: alpha(theme.palette.primary.main, 0.1),
                    label: ROLE_DICTIONARY[role] || role
                };
            case 'MANAGER':
                return {
                    color: theme.palette.secondary.main,
                    bgColor: alpha(theme.palette.secondary.main, 0.1),
                    label: ROLE_DICTIONARY[role] || role
                };
            case 'USER':
                return {
                    color: theme.palette.success.main,
                    bgColor: alpha(theme.palette.success.main, 0.1),
                    label: ROLE_DICTIONARY[role] || role
                };
            case 'CLIENT':
                return {
                    color: theme.palette.info.main,
                    bgColor: alpha(theme.palette.info.main, 0.1),
                    label: ROLE_DICTIONARY[role] || role
                };
            default:
                return {
                    color: theme.palette.grey[700],
                    bgColor: alpha(theme.palette.grey[500], 0.1),
                    label: ROLE_DICTIONARY[role] || role
                };
        }
    };

    // Verificar se o usuário tem uma role específica
    const hasRole = (roleToCheck) => {
        return user.roles && user.roles.includes(roleToCheck);
    };

    // Obter a role principal (para o ícone de avatar)
    const getPrimaryRole = () => {
        if (hasRole('ADMIN')) return 'ADMIN';
        if (hasRole('MANAGER')) return 'MANAGER';
        if (hasRole('USER')) return 'USER';
        if (hasRole('CLIENT')) return 'CLIENT';
        return user.roles?.[0] || 'GUEST';
    };

    const primaryRole = getPrimaryRole();
    const roleConfig = getRoleConfig(primaryRole);
    const RoleIcon = getRoleIcon(primaryRole);

    return (
        <>
            <Card
                elevation={1}
                sx={{
                    mb: 2,
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'visible',
                    transition: 'all 0.2s',
                    '&:hover': {
                        boxShadow: theme.shadows[8]
                    }
                }}
            >
                {/* Role icon indicator */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: roleConfig.bgColor,
                        color: roleConfig.color
                    }}
                >
                    <SvgIcon component={RoleIcon} fontSize="small" />
                </Box>

                {/* Header content */}
                <Box sx={{ pt: 2, pb: 1, pl: 8, pr: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h5" color="text.primary" gutterBottom={false}>
                                {user.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <EmailIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                {user.email}
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={1} alignItems="center">
                            {user.roles && user.roles.map((role) => {
                                const config = getRoleConfig(role);
                                return (
                                    <Chip
                                        key={role}
                                        label={config.label}
                                        size="small"
                                        sx={{
                                            backgroundColor: config.bgColor,
                                            color: config.color,
                                            fontWeight: 500,
                                            fontSize: '0.75rem',
                                            height: 24,
                                            borderRadius: '4px'
                                        }}
                                    />
                                );
                            })}

                            <Box sx={{ display: 'flex', ml: 1 }}>
                                <Tooltip title="Visualizar">
                                    <IconButton
                                        size="small"
                                        onClick={handleViewOpen}
                                        sx={{
                                            color: theme.palette.info.main,
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.info.main, 0.1)
                                            }
                                        }}
                                    >
                                        <VisibilityOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Editar">
                                    <IconButton
                                        size="small"
                                        onClick={handleEditOpen}
                                        sx={{
                                            color: theme.palette.primary.main,
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                            }
                                        }}
                                    >
                                        <EditOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Stack>
                    </Stack>
                </Box>

                <Divider />

                {/* Main information section */}
                <Box sx={{ p: 2 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                        {/* Left column - User information */}
                        <Stack spacing={1.5} sx={{ minWidth: { xs: '100%', sm: '45%' } }}>
                            {/* User information */}
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
                                >
                                    <PersonOutlineIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                    Informações do Usuário
                                </Typography>

                                <Stack spacing={1} sx={{ pl: 1 }}>
                                    <Typography variant="body2" color="text.primary">
                                        <strong>ID:</strong> {user.id}
                                    </Typography>

                                    <Typography variant="body2" color="text.primary">
                                        <strong>Nome:</strong> {user.name}
                                    </Typography>

                                    <Tooltip title={user.email} placement="top">
                                        <Typography
                                            variant="body2"
                                            color="text.primary"
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                "& .icon": {
                                                    color: theme.palette.primary.light,
                                                    mr: 0.5,
                                                    fontSize: 16
                                                },
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            <EmailIcon className="icon" />
                                            <strong>Email:</strong> {user.email}
                                        </Typography>
                                    </Tooltip>
                                </Stack>
                            </Box>
                        </Stack>

                        {/* Right column - Status/Dates */}
                        <Stack spacing={1.5} sx={{ minWidth: { xs: '100%', sm: '45%' } }}>
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
                                >
                                    <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                    Datas
                                </Typography>

                                <Stack spacing={1} sx={{ pl: 1 }}>
                                    <Typography variant="body2" color="text.primary">
                                        <strong>Criado em:</strong> {formatDate(user.created_at)}
                                    </Typography>

                                    <Typography variant="body2" color="text.primary">
                                        <strong>Atualizado em:</strong> {formatDate(user.updated_at)}
                                    </Typography>

                                    {hasRole('ADMIN') && (
                                        <Typography
                                            variant="body2"
                                            color="text.primary"
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                "& .icon": {
                                                    color: theme.palette.primary.main,
                                                    mr: 0.5,
                                                    fontSize: 16
                                                }
                                            }}
                                        >
                                            <VerifiedUserOutlinedIcon className="icon" />
                                            <strong>Permissões administrativas</strong>
                                        </Typography>
                                    )}
                                </Stack>
                            </Box>
                        </Stack>
                    </Stack>
                </Box>
            </Card>

            {/* Modal de Visualização */}
            <UserViewModal
                open={viewModalOpen}
                onClose={handleViewClose}
                user={user}
            />

            {/* Modal de Edição */}
            <UserEditModal
                open={editModalOpen}
                onClose={handleEditClose}
                user={user}
            />
        </>
    );
};

UserItem.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
        roles: PropTypes.arrayOf(PropTypes.string)
    }).isRequired
};

export default UserItem;