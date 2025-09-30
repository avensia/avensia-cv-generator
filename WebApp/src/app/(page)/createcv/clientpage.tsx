'use client';

import React, { useState, useEffect } from 'react';
import ClientPdfViewer from '@/components/pdfgenerator/createpdfclient';
import CVFormPage from './cvform';
import { CVFormData } from './defaullt_data';
import { logout } from '@/app/lib/auth';
import { Button } from '@/components/ui/button';

const CreateCvClient = () => {
  const [cv, setCv] = useState<CvData>(CVFormData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCv = async () => {
      try {
        const res = await fetch('/api/cv'); // ✅ must match your API route
        if (res.status === 404) {
          // user has no CV yet
          setCv(CVFormData);
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to fetch CV');
        }

        const cvData: CvData = await res.json();
        setCv(cvData);
      } catch (err) {
        console.error(err);
        setCv(CVFormData); // fallback to default blank CV
      } finally {
        setLoading(false);
      }
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
          <CVFormPage setForm={setCv} form={cv} />
        </div>
        {/* Right side: PDF Preview */}
        <div className="p-6 overflow-y-auto">
          <form action={logout}>
            <Button className="mb-5" type="submit">
              Logout
            </Button>
          </form>
          <ClientPdfViewer cvData={cv} />
        </div>
      </div>
    </div>
  );
};

export default CreateCvClient;
