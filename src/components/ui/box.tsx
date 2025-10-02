import { ReactElement } from 'react';

export const PageCenter: React.FunctionComponent<{ children: ReactElement }> = props => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-250 h-full">{props.children}</div>
    </div>
  );
};
