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