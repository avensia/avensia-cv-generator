import { ReactElement } from 'react';

export const PageCenter: React.FunctionComponent<{ children: ReactElement }> = props => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-250 ">{props.children}</div>
    </div>
  );
};
