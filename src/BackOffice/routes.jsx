import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from '@layouts/dashboard';
import LogoOnlyLayout from '@layouts/LogoOnlyLayout';

import DashboardApp from '@pages/DashboardApp';
import NotFound from '@pages/Page404';

import Users from './packs/Users';
import User from './packs/User';

import Companies from './packs/Companies/';
import Company from './packs/Company';

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'users', element: <Users /> },
        { path: 'users/new', element: <User isNew /> },
        { path: 'users/:userId', element: <User /> },
        { path: 'companies', element: <Companies /> },
        { path: 'companies/new', element: <Company isNew /> },
        { path: 'companies/:companyId', element: <Company /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to='/dashboard/app' /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to='/404' /> },
      ],
    },
    { path: '*', element: <Navigate to='/404' replace /> },
  ]);
}
