'use client';

import React, { useEffect } from 'react';
import CVFormPage from './cvform';
import { useCv } from './useCv';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/lib/auth';

const CreateCvClient = () => {
  const { cv, refresh, loading } = useCv();

  useEffect(() => {
    const fetchMyCv = async () => {
      refresh();
    };

    fetchMyCv();
  }, []);

  if (loading) {
    return <p className="p-6">Loading your CV...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-1  h-full">
        {/* Left side: Form */}
        <div className="p-6 border-r border-gray-200 overflow-y-auto">
          <form action={logout}>
            <Button className="mb-5" type="submit">
              Logout
            </Button>
          </form>
          <CVFormPage form={cv} />
        </div>
      </div>
    </div>
  );
};

export default CreateCvClient;
