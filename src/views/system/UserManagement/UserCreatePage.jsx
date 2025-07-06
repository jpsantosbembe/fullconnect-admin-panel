import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme, alpha } from '@mui/material/styles';
import {
    Box,
    Button,
    Card,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    CircularProgress,
    MenuItem,
    Alert,
    Fade,
    Tooltip
} from '@mui/material';

// icons
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyIcon from '@mui/icons-material/Key';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import userService from '../../../services/userService';
import roleService from '../../../services/roleService';

// Passos do formulário
const steps = ['Informações do Usuário', 'Senha Temporária'];

const UserCreatePage = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    // Estados para o formulário multi-step
    const [activeStep, setActiveStep] = useState(0);
    const [copied, setCopied] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Estados para os dados do usuário
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [roles, setRoles] = useState([]);
    const [temporaryPassword, setTemporaryPassword] = useState('');

    // Estados para o status da requisição
    const [isLoading, setIsLoading] = useState(false);
    const [isRolesLoading, setIsRolesLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Efeito para carregar os papéis ao montar o componente
    useEffect(() => {
        const fetchRoles = async () => {
            setIsRolesLoading(true);
            try {
                const fetchedRoles = await roleService.getRoles();
                setRoles(fetchedRoles);
                // Se houver papéis, pré-seleciona o primeiro ou um padrão
                if (fetchedRoles.length > 0) {
                    setSelectedRole(fetchedRoles[0].name);
                }
            } catch (err) {
                console.error("Failed to fetch roles:", err);
                setError("Falha ao carregar papéis. Por favor, tente novamente.");
            } finally {
                setIsRolesLoading(false);
            }
        };

        fetchRoles();
    }, []);

    // Função para lidar com o envio do formulário
    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const userData = {
                name,
                email,
                roleName: selectedRole,
            };

            const response = await userService.createUser(userData);

            // Verificar a resposta da API
            if (response && response.temporaryPassword) {
                setTemporaryPassword(response.temporaryPassword);
                setSuccessMessage('Usuário criado com sucesso!');
                // Avança para o próximo passo
                setActiveStep(1);
            } else {
                // Se não há senha temporária, algo está errado
                throw new Error('Resposta da API não contém senha temporária');
            }
        } catch (err) {
            console.error("Failed to create user:", err);

            // Tratamento específico para email já registrado
            if (err.response && err.response.data && err.response.data.message === "Email already registered") {
                setError("Este email já está registrado no sistema.");
            } else {
                setError("Falha ao criar usuário. Verifique os dados e tente novamente.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Função para copiar a senha temporária
    const handleCopyPassword = () => {
        navigator.clipboard.writeText(temporaryPassword)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error('Erro ao copiar senha:', err);
            });
    };

    // Função para finalizar o processo
    const handleFinish = () => {
        navigate('/users/list'); // Redireciona para a listagem de usuários
    };

    // Função para alternar a visibilidade da senha
    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Renderiza o conteúdo baseado no passo atual
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Nome Completo"
                                    variant="outlined"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    placeholder="Digite o nome completo"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    placeholder="Digite o email corporativo"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Papel do Usuário"
                                    variant="outlined"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    required
                                    disabled={isLoading || isRolesLoading}
                                    helperText={isRolesLoading ? "Carregando papéis..." : "Selecione o papel do usuário no sistema"}
                                >
                                    {isRolesLoading ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={20} sx={{ mr: 1 }} /> Carregando...
                                        </MenuItem>
                                    ) : roles.length === 0 ? (
                                        <MenuItem disabled>Nenhum papel encontrado</MenuItem>
                                    ) : (
                                        roles.map((role) => (
                                            <MenuItem key={role.id} value={role.name}>
                                                {role.name}
                                            </MenuItem>
                                        ))
                                    )}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                {error && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {error}
                                    </Alert>
                                )}
                            </Grid>
                        </Grid>
                    </form>
                );

            case 1:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                mb: 3,
                                border: '1px solid',
                                borderColor: theme.palette.success.light,
                                backgroundColor: alpha(theme.palette.success.light, 0.1),
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="h5" gutterBottom sx={{ color: theme.palette.success.dark, display: 'flex', alignItems: 'center' }}>
                                <CheckCircleOutlineIcon sx={{ mr: 1 }} />
                                Usuário Criado com Sucesso
                            </Typography>

                            <Typography variant="body1" paragraph>
                                O usuário <strong>{name}</strong> foi criado com sucesso. Abaixo está a senha temporária gerada pelo sistema.
                                Por favor, compartilhe esta senha com o usuário de forma segura.
                            </Typography>

                            <Box sx={{ my: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Senha Temporária:
                                </Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={temporaryPassword}
                                    InputProps={{
                                        readOnly: true,
                                        type: showPassword ? 'text' : 'password',
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <KeyIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip title={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                                                    <IconButton
                                                        onClick={handleTogglePasswordVisibility}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={copied ? "Copiado!" : "Copiar senha"}>
                                                    <IconButton
                                                        onClick={handleCopyPassword}
                                                        edge="end"
                                                        color={copied ? "success" : "default"}
                                                    >
                                                        <ContentCopyIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            bgcolor: theme.palette.background.paper,
                                            fontFamily: 'monospace',
                                            letterSpacing: '0.1em',
                                            fontSize: '1.1rem'
                                        }
                                    }}
                                />
                                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                                    Esta senha só é exibida uma vez. Certifique-se de copiá-la antes de prosseguir.
                                </Typography>
                            </Box>
                        </Paper>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleFinish}
                                sx={{ minWidth: 200 }}
                            >
                                Concluir
                            </Button>
                        </Box>
                    </Box>
                );

            default:
                return 'Passo desconhecido';
        }
    };

    return (
        <MainCard title="Cadastrar Novo Usuário">
            <Box sx={{ width: '100%', mb: 4 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            <Card
                elevation={2}
                sx={{
                    overflow: 'visible',
                    borderRadius: 2,
                    mb: 3
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Fade in={true} timeout={500}>
                        <Box>
                            {getStepContent(activeStep)}
                        </Box>
                    </Fade>
                </Box>
            </Card>

            {activeStep === 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/users/list')}
                        sx={{ mr: 2 }}
                    >
                        Voltar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isLoading || isRolesLoading || !name || !email || !selectedRole}
                        endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                        onClick={handleSubmit}
                    >
                        {isLoading ? 'Criando...' : 'Criar Usuário'}
                    </Button>
                </Box>
            )}
        </MainCard>
    );
};

export default UserCreatePage;