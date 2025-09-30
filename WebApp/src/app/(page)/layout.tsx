import React from 'react';

type PropsType = {
  children: React.ReactNode;
};

const PageLayout = ({ children }: Readonly<PropsType>) => {
  return <div className="mt-10 mx-auto">{children}</div>;
};

export default PageLayout;
