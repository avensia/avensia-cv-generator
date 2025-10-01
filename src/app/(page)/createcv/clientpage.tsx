'use client';

import React, { useEffect } from 'react';
import ClientPdfViewer from '@/components/pdfgenerator/createpdfclient';
import CVFormPage from './cvform';
import { useCv } from './useCv';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/lib/auth';
import CvPreview from './cvpreview';

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
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        {/* Left side: Form */}
        <div className="p-6 border-r border-gray-200 overflow-y-auto">
          <CVFormPage form={cv} />
        </div>
        {/* Right side: PDF Preview */}
        <div className="p-6 overflow-y-auto hide">
          <form action={logout}>
            <Button className="mb-5" type="submit">
              Logout
            </Button>
          </form>
          <Button onClick={refresh} className="mb-5" type="submit">
            Update
          </Button>
          <CvPreview />
          <ClientPdfViewer cvData={cv} />
        </div>
      </div>
    </div>
  );
};

export default CreateCvClient;
