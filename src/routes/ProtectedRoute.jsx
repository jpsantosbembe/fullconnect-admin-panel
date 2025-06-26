import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute() {
    // 1. Pegamos também o estado de 'isLoading' do contexto
    const { isAuthenticated, isLoading } = useAuth();

    // 2. Se a verificação inicial ainda está acontecendo, esperamos.
    //    Renderizamos um loader, ou simplesmente nada (null).
    if (isLoading) {
        return <div>Carregando sua sessão...</div>; // Ou um componente de Spinner
    }

    // 3. Apenas depois que o carregamento terminar (isLoading é false),
    //    verificamos se o usuário está autenticado.
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 4. Se o carregamento terminou e o usuário está autenticado, renderizamos a rota filha.
    return <Outlet />;
}

export default ProtectedRoute;