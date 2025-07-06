import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';

// icons
import CloseIcon from '@mui/icons-material/Close';

/**
 * Modal para edição de um usuário
 */
const UserEditModal = ({ open, onClose, user }) => {
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: 2,
                    boxShadow: theme.shadows[5]
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Editar Usuário</Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: theme.palette.grey[500]
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ p: 3 }}>
                {/* Conteúdo do modal de edição */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" color="primary" gutterBottom>
                        {user.name}
                    </Typography>
                </Box>

                <Typography variant="body1" paragraph>
                    Este é um placeholder para o modal de edição do usuário.
                    Aqui seriam exibidos campos de formulário para editar os dados do usuário.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                >
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{ minWidth: 120 }}
                >
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

UserEditModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
};

export default UserEditModal;