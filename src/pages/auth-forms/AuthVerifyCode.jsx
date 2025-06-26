import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AnimateButton from '../../ui-component/extended/AnimateButton';
import authService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

// Configuração para textos dinâmicos
const methodConfig = {
    EMAIL: {
        title: 'Verifique o seu Email',
        subtitle: 'Enviámos um código de 6 dígitos para o seu endereço de email.'
    },
    SMS: {
        title: 'Verifique o seu Telemóvel',
        subtitle: 'Enviámos um código de 6 dígitos para o seu número de telemóvel.'
    },
    TOTP: {
        title: 'Código do Aplicativo',
        subtitle: 'Insira o código de 6 dígitos do seu aplicativo de autenticação.'
    },
    DEFAULT: {
        title: 'Insira o Código de Verificação',
        subtitle: 'Verifique a sua identidade para continuar.'
    }
};

// ===============================|| AUTH - VERIFY CODE FORM ||=============================== //

export default function AuthVerifyCode() {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // 2. CORREÇÃO: Pegamos a função correta do contexto.
    const { completeLogin } = useAuth();

    // Estados do componente
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { preAuthToken, method } = location.state || {};
    const config = methodConfig[method] || methodConfig.DEFAULT;

    // ... (o useEffect de segurança está perfeito, sem alterações)
    useEffect(() => {
        if (!preAuthToken || !method) {
            navigate('/login');
        }
    }, [preAuthToken, method, navigate]);

    // 3. CORREÇÃO: A lógica do handleSubmit é simplificada.
    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log('[PASSO 1 - AuthVerifyCode] Tentando completar o login com:', { preAuthToken, method, code });

        setIsLoading(true);
        setError(null);

        try {
            // Chamamos APENAS a função do contexto.
            // Ela vai, por sua vez, chamar o authService e atualizar o estado global (setUser).
            await completeLogin(preAuthToken, method, code);

            // Se a linha acima não der erro, o login foi bem-sucedido!
            navigate('/dashboard');

        } catch (err) {
            // O erro já vem tratado do contexto/serviço
            setError(err.message || 'Código inválido ou expirado. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                <Grid item xs={12}>
                    <Stack spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Typography gutterBottom variant="h2" sx={{ color: 'secondary.main' }}>
                            {config.title}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                            {config.subtitle}
                        </Typography>
                    </Stack>
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth error={Boolean(error)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-2fa-code">Código de Verificação</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-2fa-code"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            name="2fa-code"
                            autoFocus
                            required
                        />
                    </FormControl>
                </Grid>

                {error && (
                    <Grid item xs={12}>
                        <FormHelperText error>{error}</FormHelperText>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Box sx={{ mt: 2 }}>
                        <AnimateButton>
                            <Button
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="secondary"
                                disabled={isLoading || code.length < 6}
                            >
                                {isLoading ? 'A verificar...' : 'Verificar'}
                            </Button>
                        </AnimateButton>
                    </Box>
                </Grid>
            </Grid>
        </form>
    );
}