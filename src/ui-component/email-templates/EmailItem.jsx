import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// icons
import EmailIcon from '@mui/icons-material/Email';
import DraftsIcon from '@mui/icons-material/Drafts';
import PublishIcon from '@mui/icons-material/Publish';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LinkIcon from '@mui/icons-material/Link';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SubjectIcon from '@mui/icons-material/Subject';

/**
 * Componente para exibir um template de email individual
 */
const EmailItem = ({ template }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    // Função para navegar para a página de edição
    const handleEdit = () => {
        navigate(`/settings/email/edit/${template.id}`);
    };

    // Função para formatar a data
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleString();
        } catch (e) {
            return dateStr;
        }
    };

    // Obter ícone para status
    const getStatusIcon = (status) => {
        switch (status.toUpperCase()) {
            case 'PUBLISHED':
                return PublishIcon;
            case 'DRAFT':
                return DraftsIcon;
            default:
                return EmailIcon;
        }
    };

    // Obter configuração de cor para status
    const getStatusConfig = (status) => {
        switch (status.toUpperCase()) {
            case 'PUBLISHED':
                return {
                    color: theme.palette.success.main,
                    bgColor: alpha(theme.palette.success.main, 0.1),
                    label: 'Publicado'
                };
            case 'DRAFT':
                return {
                    color: theme.palette.warning.main,
                    bgColor: alpha(theme.palette.warning.main, 0.1),
                    label: 'Rascunho'
                };
            default:
                return {
                    color: theme.palette.grey[700],
                    bgColor: alpha(theme.palette.grey[500], 0.1),
                    label: status
                };
        }
    };

    const StatusIcon = getStatusIcon(template.status);
    const statusConfig = getStatusConfig(template.status);

    return (
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
            {/* Status icon indicator */}
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
                    backgroundColor: statusConfig.bgColor,
                    color: statusConfig.color
                }}
            >
                <SvgIcon component={StatusIcon} fontSize="small" />
            </Box>

            {/* Header content */}
            <Box sx={{ pt: 2, pb: 1, pl: 8, pr: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h5" color="text.primary" gutterBottom={false}>
                            {template.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <LinkIcon sx={{ fontSize: 14, mr: 0.5 }} />
                            {template.slug}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                            label={statusConfig.label}
                            size="small"
                            sx={{
                                backgroundColor: statusConfig.bgColor,
                                color: statusConfig.color,
                                fontWeight: 500,
                                fontSize: '0.75rem',
                                height: 24,
                                borderRadius: '4px'
                            }}
                        />

                        <Box sx={{ display: 'flex', ml: 1 }}>
                            <Tooltip title="Editar">
                                <IconButton
                                    size="small"
                                    onClick={handleEdit}
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
                    {/* Left column - Email details */}
                    <Stack spacing={1.5} sx={{ minWidth: { xs: '100%', sm: '45%' } }}>
                        <Box>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
                            >
                                <EmailIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                Informações do Template
                            </Typography>

                            <Stack spacing={1} sx={{ pl: 1 }}>
                                <Typography variant="body2" color="text.primary">
                                    <strong>ID:</strong> {template.id}
                                </Typography>

                                <Typography variant="body2" color="text.primary">
                                    <strong>Nome:</strong> {template.name}
                                </Typography>

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
                                        }
                                    }}
                                >
                                    <LinkIcon className="icon" />
                                    <strong>Slug:</strong> {template.slug}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.primary"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        "& .icon": {
                                            color: theme.palette.secondary.main,
                                            mr: 0.5,
                                            fontSize: 16
                                        }
                                    }}
                                >
                                    <SubjectIcon className="icon" />
                                    <strong>Assunto:</strong> {template.subject}
                                </Typography>
                            </Stack>
                        </Box>
                    </Stack>

                    {/* Right column - Dates */}
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
                                    <strong>Criado em:</strong> {formatDate(template.created_at)}
                                </Typography>

                                <Typography variant="body2" color="text.primary">
                                    <strong>Atualizado em:</strong> {formatDate(template.updated_at)}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.primary"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        "& .icon": {
                                            color: statusConfig.color,
                                            mr: 0.5,
                                            fontSize: 16
                                        }
                                    }}
                                >
                                    <StatusIcon className="icon" />
                                    <strong>Status:</strong> {statusConfig.label}
                                </Typography>
                            </Stack>
                        </Box>
                    </Stack>
                </Stack>
            </Box>
        </Card>
    );
};

EmailItem.propTypes = {
    template: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        subject: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
        updated_at: PropTypes.string.isRequired,
    }).isRequired
};

export default EmailItem;