import React from 'react';
import { ToggleTheme } from '@/components/ToggleTheme';
import Logo from '@/components/logo';
import DropdownMenuClient from './dropdown-menu';
import Link from 'next/link';
import UserNameWithAvatar from './username-with-avatar';

type PropsType = {
  children: React.ReactNode;
};

const Header = ({ children }: Readonly<PropsType>) => {
  return (
    <div className="min-h-screen w-full py-10">
      <div className="mb-10 flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex flex-row items-center gap-5 ">
          <UserNameWithAvatar />
          <ToggleTheme />
          <DropdownMenuClient />
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
