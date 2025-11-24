import React, { useState } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type PropsType = {
  userId: string;
  selectedValue: string;
  roles: Roles[];
  oneChangeRole: (userId: string, roleId: string) => void;
};

export function RoleSelector({ userId, selectedValue, roles, oneChangeRole }: PropsType) {
  const [selectedRole, setRole] = useState<string>(selectedValue);

  const handleChange = (value: string) => {
    setRole(value);
    oneChangeRole(userId, value);
  };

  return (
    <Select value={selectedRole} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a role " />
      </SelectTrigger>
      <SelectContent>
        {roles?.map(role => (
          <SelectItem key={role.id} value={String(role.id)}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
