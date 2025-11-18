'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

type PropsType = {
  imgName: string;
  imgVersion: string;
  fullName?: string;
  className?: string;
  alt?: string;
};

const AcvtAvatar = ({ fullName, imgName, imgVersion, className, alt }: PropsType) => {
  const imgUrl = imgName ? `/api/cloudflare/fetch-photo/${encodeURIComponent(imgName)}?v=${imgVersion}` : '';

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={imgUrl} alt={alt ?? 'PF'} />
      <AvatarFallback>{fullName ? getInitials(fullName) : 'PF'}</AvatarFallback>
    </Avatar>
  );
};

export default AcvtAvatar;

function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/) // handles multiple spaces
    .map(word => word[0].toUpperCase())
    .join('');
}
