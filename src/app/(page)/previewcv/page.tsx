'use client';

import React from 'react';
import { useCv } from '../createcv/useCv';
import ClientPdfViewer from '@/components/pdfgenerator/createpdfclient';
import Pdfdownlink from '@/components/pdfgenerator/pdfdownlink';
import { PageCenter } from '@/components/ui/box';
import Link from 'next/link';

const PreviewCv = () => {
  const { cv, loading } = useCv();

  if (loading) {
    return (
      <PageCenter>
        <p className="p-6">Loading your PDF...</p>
      </PageCenter>
    );
  }

  return (
    <PageCenter>
      <>
        <div className="mb-5 flex gap-5 items-center">
          <Link href="/createcv">Back to CV Form</Link>
          <Pdfdownlink cvData={cv} />
        </div>
        <ClientPdfViewer cvData={cv} />
      </>
    </PageCenter>
  );
};

export default PreviewCv;
