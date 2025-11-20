'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LogoutAlert } from '../createcv/cvform/components/logout';
import { useUserRole } from '@/lib/hooks/use-user-role';

const DropdownMenuClient = () => {
  const { push } = useRouter();
  const { data, loading } = useUserRole();

  const handleNavigate = (url: string) => {
    push(url);
  };

  return (
    !loading && (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Menu />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleNavigate('/')}>Home</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigate('/previewcv')}>Generate CV as PDF</DropdownMenuItem>
          {(data?.userRole === 'admin' || data?.userRole === 'manager') && (
            <DropdownMenuItem onClick={() => handleNavigate('/search')}>Search Resource CVs</DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <LogoutAlert
            buttonElement={
              <div className="focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                Logout
              </div>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
};

export default DropdownMenuClient;
