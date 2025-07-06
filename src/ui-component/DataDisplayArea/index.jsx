// src/ui-component/DataDisplayArea/index.jsx
import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles'; // Importar useTheme para usar spacing

const DataDisplayArea = ({ isLoading, error, hasData, emptyMessage, children }) => {
    const theme = useTheme(); // Inicializar useTheme para acessar theme.spacing

    if (isLoading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexGrow: 1, // Permite que o Box de carregamento ocupe o espaço
                // Se a barra de rolagem ainda sumir aqui, adicione minHeight: 0
                minHeight: 0,
                // Adiciona padding para o conteúdo de carregamento
                padding: theme.spacing(2)
            }}>
                <CircularProgress />
                <Typography variant="subtitle1" sx={{ ml: 2 }}>Carregando...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" sx={{
                mt: 4,
                textAlign: 'center',
                flexGrow: 1, // Permite que a mensagem de erro ocupe o espaço
                // Se a barra de rolagem ainda sumir aqui, adicione minHeight: 0
                minHeight: 0,
                padding: theme.spacing(2)
            }}>
                Erro: {error}
            </Typography>
        );
    }

    if (!hasData) {
        return (
            <Paper sx={{
                p: 3,
                mt: 2,
                textAlign: 'center',
                flexGrow: 1, // Permite que a mensagem de vazio ocupe o espaço
                // Se a barra de rolagem ainda sumir aqui, adicione minHeight: 0
                minHeight: 0,
                padding: theme.spacing(2)
            }}>
                <Typography variant="subtitle1" color="text.secondary">
                    {emptyMessage || 'Nenhum item encontrado com os critérios atuais.'}
                </Typography>
            </Paper>
        );
    }

    // Este é o Box que encapsula o 'children' (sua lista de logs)
    // e é responsável pela rolagem e padding quando há dados.
    return (
        <Box
            sx={{
                flexGrow: 1, // Faz com que ele ocupe o espaço restante verticalmente
                minHeight: 0, // CRUCIAL para que flexGrow: 1 funcione com overflowY: 'auto'
                overflowY: 'auto', // Adiciona a barra de rolagem verticalmente
                padding: theme.spacing(2), // Aplica o padding desejado ao redor do conteúdo que rola
                // O margin-top que você tinha no Box do AuditLogsPage não é mais necessário aqui,
                // pois o padding já cria o espaçamento interno.
            }}
        >
            {children}
        </Box>
    );
};

DataDisplayArea.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    hasData: PropTypes.bool.isRequired,
    emptyMessage: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export default DataDisplayArea;