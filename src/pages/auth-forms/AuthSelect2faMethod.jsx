import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// 1. Importar os novos ícones
import { IconMail, IconDeviceMobile, IconShieldLock } from '@tabler/icons-react';

// project imports
import AnimateButton from '../../ui-component/extended/AnimateButton';
import authService from '../../services/authService.js';

const methodConfig = {
    EMAIL: {
        icon: <IconMail />,
        text: 'Receber código por Email'
    },
    TOTP: {
        icon: <IconShieldLock />,
        text: 'Usar código do Aplicativo'
    },
    SMS: {
        icon: <IconDeviceMobile />,
        text: 'Receber código por SMS'
    },
    DEFAULT: {
        icon: <IconShieldLock />,
        text: 'Usar método de verificação'
    }
};

// ===============================|| AUTH - SELECT 2FA FORM ||=============================== //

export default function AuthSelect2faMethod() {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const { preAuthToken, methods } = location.state || {};

    // Medida de segurança: se não houver preAuthToken, volta para o login
    useEffect(() => {
        if (!preAuthToken) {
            navigate('/login');
        }
    }, [preAuthToken, navigate]);

    const handleSelectMethod = async (method) => {
        // Para TOTP, não precisamos de chamar a API, vamos direto para a verificação
        if (method === 'TOTP') {
            navigate('/login/verify-code', {
                state: { preAuthToken, method }
            });
            return;
        }

        // Para EMAIL e SMS, chamamos a API para enviar o código
        try {
            await authService.select2faMethod(preAuthToken, method);
            navigate('/login/verify-code', {
                state: { preAuthToken, method }
            });
        } catch (error) {
            console.error('Falha ao selecionar o método 2FA:', error);
            navigate('/login');
        }
    };

    return (
        <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <Grid item xs={12}>
                <Stack spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Typography gutterBottom variant="h2" sx={{ color: 'secondary.main' }}>
                        Verificação de Dois Fatores
                    </Typography>
                    <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                        Selecione um método para continuar.
                    </Typography>
                </Stack>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
                <Stack spacing={2}>
                    {methods?.map((method) => {
                        // 3. Obter a configuração correta para o método atual
                        const config = methodConfig[method] || methodConfig.DEFAULT;
                        return (
                            <AnimateButton key={method}>
                                <Button
                                    fullWidth
                                    size="large"
                                    variant="outlined"
                                    onClick={() => handleSelectMethod(method)}
                                    startIcon={config.icon}
                                >
                                    {config.text}
                                </Button>
                            </AnimateButton>
                        );
                    })}
                    {!methods && (
                        <Typography variant="body2" sx={{ textAlign: 'center' }}>
                            Nenhum método de verificação disponível.
                        </Typography>
                    )}
                </Stack>
            </Grid>
        </Grid>
    );
}