'use client';

import React from 'react';
import { useCv } from '../createcv/useCv';
import AcvtAvatar from '@/components/acvt-avatar';

const UserNameWithAvatar = () => {
  const { cv } = useCv();

  return (
    <div className="flex flex-row items-center gap-5">
      <div className="text-sm">{cv?.fullName}</div>
      <AcvtAvatar imgName={cv?.imgDataUrl} imgVersion={cv?.imgVersion} fullName={cv?.fullName} className="rounded-lg" />
    </div>
  );
};

export default UserNameWithAvatar;
