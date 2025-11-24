'use client';

import React from 'react';
import { useCvWithRole } from './use-cv-with-role';
import UsersLists from './users-lists';
import { useGetRoles } from '@/lib/hooks/use-get-roles';

const ManageUsersClient = () => {
  const { cvWithRole } = useCvWithRole();
  const { data: roles } = useGetRoles();

  console.log({ cvWithRole });
  return <UsersLists data={cvWithRole} roles={roles} />;
};

export default ManageUsersClient;
