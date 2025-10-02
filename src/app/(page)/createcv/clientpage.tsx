'use client';

import React, { useEffect } from 'react';
import CVFormPage from './cvform';
import { useCv } from './useCv';
import { PageCenter } from '@/components/ui/box';

const CreateCvClient = () => {
  const { cv, refresh, loading } = useCv();

  useEffect(() => {
    const fetchMyCv = async () => {
      refresh();
    };

    fetchMyCv();
  }, []);

  if (loading) {
    return (
      <PageCenter>
        <p className="p-6">Loading your CV...</p>
      </PageCenter>
    );
  }

  return (
    <PageCenter>
      <>
        <CVFormPage form={cv} />
      </>
    </PageCenter>
  );
};

export default CreateCvClient;
