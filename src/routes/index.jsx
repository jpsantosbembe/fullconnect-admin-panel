import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LoginPage from '../pages/authentication/Login.jsx';
import DashboardDefault from '../views/dashboard/Default';
import MainLayout from '../layout/MainLayout';
import Loadable from '../ui-component/Loadable';

import ProtectedRoute from './ProtectedRoute';
import Select2faMethodPage from "../pages/authentication/Select2faMethod.jsx";
import VerifyCodePage from "../pages/authentication/VerifyCodePage.jsx";
import AuditLogsPage from "../views/system/AuditLogs/index.jsx";
import UserListPage from "../views/system/UserManagement/UserListPage.jsx";
import UserCreatePage from "../views/system/UserManagement/UserCreatePage.jsx";
import EmailListPage from "../views/system/EmailTemplates/EmailListPage.jsx";
import EmailEditPage from "../views/system/EmailTemplates/EmailEditPage.jsx";
import EmailCreatePage from "../views/system/EmailTemplates/EmailCreatePage.jsx";

const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/login/select-method',
        element: <Select2faMethodPage />
    },
    {
        path: '/login/verify-code',
        element: <VerifyCodePage />
    },
    {
        // This is the parent route that enforces protection AND provides MainLayout
        path: '/',
        element: <ProtectedRoute />, // First, ensure the user is authenticated
        children: [
            {
                element: <MainLayout />, // If authenticated, render MainLayout
                children: [ // Routes nested here will render inside MainLayout's <Outlet>
                    {
                        path: 'dashboard',
                        element: <DashboardDefault />, // Render the DashboardDefault component
                    },
                    {
                        path: 'log/list', // This URL matches the existing menu item
                        element: <AuditLogsPage />, // The AuditLogsPage will now render inside MainLayout's Outlet
                    },
                    {
                        path: 'users/list', // NOVA ROTA: Para a página de listagem de usuários
                        element: <UserListPage />, // O componente UserListPage será renderizado
                    },
                    {
                        path: 'users/add',
                        element: <UserCreatePage />,
                    },
                    {
                        path: 'settings/email/list',
                        element: <EmailListPage />,
                    },
                    {
                        path: 'settings/email/new',
                        element: <EmailCreatePage />,
                    },
                    {
                        path: 'settings/email/edit/:id',
                        element: <EmailEditPage />,
                    },
                    // Redirecionamento para compatibilidade com URLs existentes
                    {
                        path: 'settings/email',
                        element: <EmailListPage />,
                    },

                    // Add other protected routes here that should use MainLayout
                ],
            },
        ],
    },
]);

function AppRouter() {
    return <RouterProvider router={router} />;
}

export default AppRouter;