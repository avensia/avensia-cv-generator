'use client';

import React, { ReactElement } from 'react';
import { useCv } from '../createcv/useCv';
import ClientPdfViewer from '@/components/pdfgenerator/createpdfclient';
import Pdfdownlink from '@/components/pdfgenerator/pdfdownlink';

const PreviewCv = () => {
  const { cv, loading } = useCv();

  if (loading) {
    return (
      <Page>
        <p className="p-6">Loading your PDF...</p>
      </Page>
    );
  }

  return (
    <Page>
      <>
        <Pdfdownlink cvData={cv} />
        <ClientPdfViewer cvData={cv} />
      </>
    </Page>
  );
};

export default PreviewCv;

const Page: React.FunctionComponent<{ children: ReactElement }> = props => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-250 h-full">{props.children}</div>
    </div>
  );
};
