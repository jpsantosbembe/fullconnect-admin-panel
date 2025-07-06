import React, { useState } from 'react';
import PropTypes from 'prop-types';

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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RouterIcon from '@mui/icons-material/Router';
import EmailIcon from '@mui/icons-material/Email';
import DevicesIcon from '@mui/icons-material/Devices';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import SecurityIcon from '@mui/icons-material/Security';
import RefreshIcon from '@mui/icons-material/Refresh';
import LockIcon from '@mui/icons-material/Lock';

/**
 * Componente de visualização de um log de auditoria individual
 */
const AuditLogItem = ({ log }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);

    // Dicionário de ações para exibição mais amigável
    const ACTION_DICTIONARY = {
        // Login e autenticação
        LOGIN_ATTEMPT: 'Tentativa de Login',
        LOGIN_ATTEMPT_CREDENTIALS: 'Login com Credenciais',
        LOGIN_SUCCESS: 'Login Bem-sucedido',
        LOGIN_FAILURE_CREDENTIALS: 'Falha nas Credenciais',
        LOGIN_ATTEMPT_2FA_REQUIRED: '2FA Requerido',
        LOGIN_FAILURE_2FA_CODE_INVALID: 'Código 2FA Inválido',
        LOGIN_FAILURE_GENERAL: 'Falha no Login',

        // Logout e sessão
        LOGOUT: 'Logout',
        LOGOUT_FAILURE: 'Falha no Logout',
        REFRESH_SESSION_SUCCESS: 'Sessão Atualizada',
        REFRESH_SESSION_FAILURE: 'Falha na Atualização',

        // Autorização
        AUTHORIZATION_FAILURE: 'Acesso Negado',
        OWNERSHIP_FAILURE: 'Propriedade Inválida',

        // Ações 2FA
        INITIATE_2FA_SETUP: 'Início de Configuração 2FA',
        COMPLETE_2FA_SETUP_SUCCESS: 'Configuração 2FA Concluída',
        COMPLETE_2FA_SETUP_FAILURE: 'Falha na Configuração 2FA',
        INITIATE_2FA_METHOD_SELECTION: 'Seleção de Método 2FA',
        SEND_2FA_CODE_EMAIL: 'Envio de Código 2FA',
        VERIFY_2FA_CODE_EMAIL_SUCCESS: 'Verificação 2FA por Email',
        VERIFY_2FA_CODE_EMAIL_FAILURE: 'Falha na Verificação 2FA',
        GENERATE_TOTP_KEY: 'Geração de Chave TOTP',
        VERIFY_2FA_CODE_TOTP_SUCCESS: 'Verificação TOTP',
        VERIFY_2FA_CODE_TOTP_FAILURE: 'Falha na Verificação TOTP',
        DISABLE_2FA_EMAIL: 'Desativação 2FA Email',
        DISABLE_2FA_TOTP: 'Desativação 2FA TOTP',

        // Usuários
        GET_USER: 'Consulta de Usuário'
    };

    // Dicionário de status para exibição mais amigável
    const STATUS_DICTIONARY = {
        SUCCESS: 'Sucesso',
        FAILURE: 'Falha',
        INFO: 'Informação',
        ATTEMPT: 'Tentativa',
        WARNING: 'Atenção',
        ERROR: 'Erro'
    };

    // Dicionário de tipos de alvo para exibição mais amigável
    const TARGET_TYPE_DICTIONARY = {
        USER: 'Usuário',
        SESSION: 'Sessão',
        ACCOUNT: 'Conta',
        PROFILE: 'Perfil',
        PERMISSION: 'Permissão',
        ROLE: 'Função',
        RESOURCE: 'Recurso',
        SETTING: 'Configuração',
        SYSTEM: 'Sistema'
    };

    // Categorias de ações para determinar ícones
    const ACTION_CATEGORIES = {
        LOGIN: [
            'LOGIN_ATTEMPT',
            'LOGIN_ATTEMPT_CREDENTIALS',
            'LOGIN_SUCCESS',
            'LOGIN_FAILURE_CREDENTIALS',
            'LOGIN_ATTEMPT_2FA_REQUIRED',
            'LOGIN_FAILURE_2FA_CODE_INVALID',
            'LOGIN_FAILURE_GENERAL'
        ],
        LOGOUT: ['LOGOUT', 'LOGOUT_FAILURE'],
        SESSION: ['REFRESH_SESSION_SUCCESS', 'REFRESH_SESSION_FAILURE'],
        AUTHORIZATION: ['AUTHORIZATION_FAILURE', 'OWNERSHIP_FAILURE'],
        TWO_FACTOR: [
            'INITIATE_2FA_SETUP',
            'COMPLETE_2FA_SETUP_SUCCESS',
            'COMPLETE_2FA_SETUP_FAILURE',
            'INITIATE_2FA_METHOD_SELECTION',
            'SEND_2FA_CODE_EMAIL',
            'VERIFY_2FA_CODE_EMAIL_SUCCESS',
            'VERIFY_2FA_CODE_EMAIL_FAILURE',
            'GENERATE_TOTP_KEY',
            'VERIFY_2FA_CODE_TOTP_SUCCESS',
            'VERIFY_2FA_CODE_TOTP_FAILURE',
            'DISABLE_2FA_EMAIL',
            'DISABLE_2FA_TOTP'
        ],
        USER_MANAGEMENT: [
            'GET_USER'
        ]
    };

    // Extrair informações do objeto details
    const extractFromDetails = (key) => {
        try {
            if (!log.details) return null;

            if (typeof log.details === 'object') {
                return log.details[key];
            }

            try {
                const parsedDetails = JSON.parse(log.details);
                return parsedDetails[key];
            } catch (e) {
                return null;
            }
        } catch (e) {
            return null;
        }
    };

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

    // Obter a categoria da ação
    const getActionCategory = (action) => {
        if (!action) return null;

        for (const [category, actions] of Object.entries(ACTION_CATEGORIES)) {
            if (actions.includes(action)) {
                return category;
            }
        }

        return null;
    };

    // Obter o ícone para a categoria da ação
    const getActionIcon = (action) => {
        const category = getActionCategory(action);

        switch (category) {
            case 'LOGIN':
                return PersonOutlineIcon;
            case 'LOGOUT':
                return LockIcon;
            case 'SESSION':
                return RefreshIcon;
            case 'AUTHORIZATION':
                return ErrorOutlineIcon;
            case 'TWO_FACTOR':
                return SecurityIcon;
            case 'USER_MANAGEMENT':
                return PersonOutlineIcon;
            default:
                return HelpOutlineIcon;
        }
    };

    // Configurações de status
    const getStatusConfig = (status) => {
        if (!status) return {
            icon: HelpOutlineIcon,
            color: theme.palette.grey[500],
            label: 'Desconhecido',
            bgColor: theme.palette.grey[100]
        };

        const upperStatus = status.toUpperCase();
        switch (upperStatus) {
            case 'SUCCESS':
                return {
                    icon: CheckCircleOutlineIcon,
                    color: theme.palette.success.main,
                    label: STATUS_DICTIONARY.SUCCESS || 'Sucesso',
                    bgColor: alpha(theme.palette.success.main, 0.1)
                };
            case 'FAILURE':
                return {
                    icon: ErrorOutlineIcon,
                    color: theme.palette.error.main,
                    label: STATUS_DICTIONARY.FAILURE || 'Falha',
                    bgColor: alpha(theme.palette.error.main, 0.1)
                };
            case 'INFO':
                return {
                    icon: InfoOutlinedIcon,
                    color: theme.palette.info.main,
                    label: STATUS_DICTIONARY.INFO || 'Informação',
                    bgColor: alpha(theme.palette.info.main, 0.1)
                };
            case 'ATTEMPT':
                return {
                    icon: HourglassEmptyIcon,
                    color: theme.palette.primary.main,
                    label: STATUS_DICTIONARY.ATTEMPT || 'Tentativa',
                    bgColor: alpha(theme.palette.primary.main, 0.1)
                };
            default:
                return {
                    icon: HelpOutlineIcon,
                    color: theme.palette.warning.main,
                    label: STATUS_DICTIONARY[upperStatus] || status,
                    bgColor: alpha(theme.palette.warning.main, 0.1)
                };
        }
    };

    // Formatar detalhes para exibição
    const formatDetails = () => {
        try {
            if (typeof log.details === 'object' && log.details !== null) {
                return JSON.stringify(log.details, null, 2);
            }

            if (typeof log.details === 'string') {
                try {
                    const parsed = JSON.parse(log.details);
                    return JSON.stringify(parsed, null, 2);
                } catch (e) {
                    return log.details;
                }
            }

            return String(log.details || '');
        } catch (e) {
            return String(log.details || '');
        }
    };

    // Formatar a ação
    const formatAction = (action) => {
        if (!action) return '';
        return ACTION_DICTIONARY[action] || action
            .split('_')
            .map(word => word.charAt(0) + word.slice(1).toLowerCase())
            .join(' ');
    };

    // Formatar o tipo de alvo
    const formatTargetType = (targetType) => {
        if (!targetType) return 'N/A';
        return TARGET_TYPE_DICTIONARY[targetType] || targetType;
    };

    // Extrair informações relevantes
    const ActionIcon = getActionIcon(log.action);
    const statusConfig = getStatusConfig(log.status || '');
    const formattedAction = formatAction(log.action || '');
    const email = extractFromDetails('email');
    const userAgent = extractFromDetails('userAgent');
    const message = extractFromDetails('message');
    const formattedDetails = formatDetails();
    const hasDetails = log.details &&
        (typeof log.details === 'object' ||
            (typeof log.details === 'string' && log.details.trim().length > 0));

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
                <SvgIcon component={statusConfig.icon} fontSize="small" />
            </Box>

            {/* Header content */}
            <Box sx={{ pt: 2, pb: 1, pl: 8, pr: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h5" color="text.primary" gutterBottom={false}>
                            {formattedAction}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                            {formatDate(log.created_at)}
                        </Typography>
                    </Box>

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
                </Stack>
            </Box>

            <Divider />

            {/* Main information section */}
            <Box sx={{ p: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    {/* Left column - User information */}
                    <Stack spacing={1.5} sx={{ minWidth: { xs: '100%', sm: '45%' } }}>
                        {/* User information */}
                        {(log.user_id || log.user_name || email) && (
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
                                    {log.user_name && (
                                        <Typography variant="body2" color="text.primary">
                                            <strong>Nome:</strong> {log.user_name}
                                        </Typography>
                                    )}

                                    {log.user_id && (
                                        <Typography variant="body2" color="text.primary">
                                            <strong>ID:</strong> {log.user_id}
                                        </Typography>
                                    )}

                                    {email && (
                                        <Tooltip title={email} placement="top">
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
                                                <strong>Email:</strong> {email}
                                            </Typography>
                                        </Tooltip>
                                    )}

                                    {message && (
                                        <Typography variant="body2" color="text.primary">
                                            <strong>Mensagem:</strong> {message}
                                        </Typography>
                                    )}
                                </Stack>
                            </Box>
                        )}
                    </Stack>

                    {/* Right column - Technical details */}
                    <Stack spacing={1.5} sx={{ minWidth: { xs: '100%', sm: '45%' } }}>
                        <Box>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
                            >
                                <RouterIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                Informações Técnicas
                            </Typography>

                            <Stack spacing={1} sx={{ pl: 1 }}>
                                <Typography variant="body2" color="text.primary">
                                    <strong>ID do Log:</strong> {log.id}
                                </Typography>

                                {log.ip_address && (
                                    <Typography variant="body2" color="text.primary">
                                        <strong>IP:</strong> {log.ip_address}
                                    </Typography>
                                )}

                                {(log.target_type || log.target_id) && (
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
                                        <GpsFixedIcon className="icon" />
                                        <strong>Alvo:</strong> {formatTargetType(log.target_type)}
                                        {log.target_id && ` (ID: ${log.target_id})`}
                                    </Typography>
                                )}

                                {userAgent && (
                                    <Tooltip title={userAgent} placement="top">
                                        <Typography
                                            variant="body2"
                                            color="text.primary"
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                "& .icon": {
                                                    color: theme.palette.grey[700],
                                                    mr: 0.5,
                                                    fontSize: 16
                                                },
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            <DevicesIcon className="icon" />
                                            <strong>Dispositivo:</strong> {userAgent}
                                        </Typography>
                                    </Tooltip>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </Stack>

                {/* Details section */}
                {hasDetails && (
                    <>
                        <Box
                            sx={{
                                mt: 2,
                                pt: 1,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}
                            onClick={() => setExpanded(!expanded)}
                        >
                            <Typography
                                variant="subtitle2"
                                color="primary"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                Detalhes Completos
                            </Typography>

                            <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpanded(!expanded);
                                }}
                            >
                                {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </Box>

                        {expanded && (
                            <Box
                                sx={{
                                    mt: 1.5,
                                    p: 2,
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? alpha(theme.palette.grey[900], 0.6)
                                        : alpha(theme.palette.grey[50], 0.6),
                                    borderRadius: 1,
                                    border: `1px solid ${theme.palette.divider}`,
                                    maxHeight: 300,
                                    overflowY: 'auto'
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    component="pre"
                                    sx={{
                                        whiteSpace: 'pre-wrap',
                                        fontFamily: '"Roboto Mono", monospace',
                                        fontSize: '0.75rem',
                                        m: 0
                                    }}
                                >
                                    {formattedDetails}
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </Card>
    );
};

AuditLogItem.propTypes = {
    log: PropTypes.object.isRequired
};

export default AuditLogItem;