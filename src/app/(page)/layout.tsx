import { PageCenter } from '@/components/ui/box';
import Image from 'next/image';
import React from 'react';

type PropsType = {
  children: React.ReactNode;
};

const PageLayout = ({ children }: Readonly<PropsType>) => {
  return (
    <PageCenter>
      <div className="min-h-screen w-full bg-gray-50 py-10">
        <div className="mb-10">
          <Image
            className="object-cover w-50"
            alt="Avensia Logo"
            src="/assets/images/avensia-horizontal-dark.png"
            width={350}
            height={97}
          />
        </div>
        {children}
      </div>
    </PageCenter>
  );
};

export default PageLayout;
