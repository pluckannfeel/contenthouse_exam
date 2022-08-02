import React from 'react';
import Iconify from '../../components/Iconify';

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'users',
    path: '/dashboard/users',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'companies',
    path: '/dashboard/companies',
    icon: getIcon('fa6-solid:building-user'),
  },
];

export default navConfig;
