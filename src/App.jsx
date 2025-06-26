import AppRouter from './routes';
import { AuthProvider } from './contexts/AuthContext';

import ThemeCustomization from "./themes";


function App() {
    return (
        <ThemeCustomization>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
        </ThemeCustomization>

    );
}

export default App;