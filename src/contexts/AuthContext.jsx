import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService, tokenService } from '../services'; // Precisamos do tokenService aqui

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const validateSession = async () => {
            const token = tokenService.getAccessToken();
            if (token) {
                try {
                    const userData = await authService.getMe();
                    if (isMounted) setUser(userData);
                } catch (error) {
                    tokenService.clearTokens();
                }
            }
            if (isMounted) setIsLoading(false);
        };
        validateSession();
        return () => { isMounted = false; };
    }, []);

    // ====================================================================
    // A LÓGICA CORRIGIDA, SEGUINDO A SUA ARQUITETURA
    // ====================================================================
    const completeLoginAndSetUser = async (preAuthToken, method, twoFactorCode) => {
        try {
            // 1. Chama o serviço, que apenas faz a chamada de API e retorna a resposta.
            const loginResponse = await authService.complete2fa(preAuthToken, method, twoFactorCode);

            if (loginResponse && loginResponse.accessToken) {
                // 2. A RESPONSABILIDADE É DESTE CONTEXTO: Salva os tokens recebidos.
                console.log("[AuthContext] Resposta da API recebida, salvando tokens...");
                tokenService.setTokens(loginResponse);

                // 3. AGORA, com os tokens garantidamente salvos, busca os dados do usuário.
                console.log("[AuthContext] Tokens salvos. Buscando dados do usuário com getMe()...");
                const userData = await authService.getMe();

                // 4. Finalmente, atualiza o estado com os dados do usuário.
                console.log("[AuthContext] Dados do usuário recebidos. Atualizando estado...");
                setUser(userData);
                return userData;
            } else {
                throw new Error("Resposta da API após 2FA não continha accessToken.");
            }
        } catch (error) {
            console.error("[AuthContext] Erro no fluxo de login:", error);
            tokenService.clearTokens();
            setUser(null);
            throw error;
        }
    };

    const logout = () => {
        tokenService.clearTokens();
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        initiateLogin: authService.initiateLogin,
        select2faMethod: authService.select2faMethod,
        completeLogin: completeLoginAndSetUser,
        logout,
    };

    if (isLoading) {
        return <div>Carregando Aplicação...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}
