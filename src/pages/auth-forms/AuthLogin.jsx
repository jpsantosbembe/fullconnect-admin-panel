import { useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AnimateButton from '../../ui-component/extended/AnimateButton';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {useNavigate} from "react-router";

// ===============================|| JWT - LOGIN ||=============================== //

export default function AuthLogin() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
      event.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
          const response = await authService.initiateLogin(email, password);

          switch (response.status) {
              case 'completed':
                  login();
                  navigate('/dashboard');
                  break;
              case '2fa_selection_required':
                  navigate('/login/select-method', {
                      state: {
                          preAuthToken: response.preAuthToken,
                          methods: response.methods
                      }
                  });
                  break;
              default:
                  setError('Ocorreu uma resposta inesperada do servidor.');
                  break;
          }
      } catch (err) {
          setError(err.toString());
      } finally {
          setIsLoading(false);
      }
  }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <FormControl fullWidth error={Boolean(error)} sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-email-login">Endereço de e-mail</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-email-login"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </FormControl>

            <FormControl fullWidth error={Boolean(error)} sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-password-login">Senha</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password-login"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                size="large"
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>

            {/* Exibição da mensagem de erro */}
            {error && (
                <Box sx={{ mt: 1 }}>
                    <FormHelperText error>{error}</FormHelperText>
                </Box>
            )}

            <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Grid item>
                    <FormControlLabel
                        control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />}
                        label="Lembrar minha sessão"
                    />
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1" component={Link} to="/forgot-password" color="secondary" sx={{ textDecoration: 'none' }}>
                        Esqueceu a senha?
                    </Typography>
                </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
                <AnimateButton>
                    <Button color="secondary" disabled={isLoading} fullWidth size="large" type="submit" variant="contained">
                        {isLoading ? 'Aguarde...' : 'Entrar'}
                    </Button>
                </AnimateButton>
            </Box>
        </form>
    );
}
