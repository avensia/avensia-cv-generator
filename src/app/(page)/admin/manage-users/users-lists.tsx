import React from 'react';
import { cn } from '@/lib/utils';
import { P } from '@/components/ui/typography';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { RoleSelector } from './role-selector';

type PropsType = {
  data: CvDataWithRole[];
  roles: Roles[];
  error?: boolean;
  className?: string;
};

const UsersLists = ({ data, roles, error, className }: PropsType) => {
  const oneChangeRole = (userId: string, roleId: string) => {
    console.log({ userId, roleId });
  };

  return (
    <div className={cn('flex flex-wrap gap-5', className)}>
      {error ? (
        <P>I couldn’t find any results matching your search.</P>
      ) : (
        data?.map(data => {
          return (
            <>
              <Item variant="outline" className="basis-[calc(33.333%-1.25rem)] p-4 items-start" key={data.userRole}>
                <ItemContent>
                  <div className="flex items-center justify-between w-full mb-5">
                    <div className="flex gap-4 items-start mb-2">
                      <div>
                        <ItemTitle className="text-base">{data.fullName}</ItemTitle>
                        <ItemDescription className="text-xs">{data.userEmail}</ItemDescription>
                      </div>
                    </div>
                  </div>
                  <ItemActions className="flex-col items-start">
                    <div className="font-semibold">Role:</div>
                    <RoleSelector
                      userId={data.userId}
                      selectedValue={String(data.userRole)}
                      roles={roles}
                      oneChangeRole={oneChangeRole}
                    />
                  </ItemActions>
                </ItemContent>
              </Item>
            </>
          );
        })
      )}
    </div>
  );
};

export default UsersLists;
