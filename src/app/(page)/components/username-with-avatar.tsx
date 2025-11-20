'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCv } from '../createcv/useCv';

const UserNameWithAvatar = () => {
  const { cv } = useCv();
  const img = cv?.imgDataUrl
    ? `/api/cloudflare/fetch-photo/${encodeURIComponent(cv?.imgDataUrl)}?v=${cv?.imgVersion}`
    : '';

  return (
    <div className="flex flex-row items-center gap-5">
      <div className="text-sm">{cv?.fullName}</div>
      <Avatar className="rounded-lg">
        <AvatarImage src={img} alt={cv?.fullName} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default UserNameWithAvatar;
