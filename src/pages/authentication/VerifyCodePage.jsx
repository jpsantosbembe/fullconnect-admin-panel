// material-ui
import Grid from '@mui/material/Grid';

// project imports
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import AuthVerifyCode from '../auth-forms/AuthVerifyCode.jsx';

// ===============================|| AUTH - VERIFY CODE PAGE ||=============================== //

export default function VerifyCodePage() {
    return (
        <AuthWrapper1>
            <Grid container direction="column" sx={{ justifyContent: 'flex-end', minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container sx={{ justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                {/* O conteúdo principal é o nosso novo formulário de verificação */}
                                <AuthVerifyCode />
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
}