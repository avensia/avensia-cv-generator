import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { CreatePDF } from '.';
import { cn } from '@/lib/utils';

type PropsType = { cvData: CvData; className?: string };

export default function ClientPdfViewer({ cvData, className }: PropsType) {
  return (
    <div className={cn('h-[70vh] w-full', className)}>
      <PDFViewer showToolbar={false} style={{ width: '100%', height: '100%' }}>
        <CreatePDF formData={cvData} />
      </PDFViewer>
    </div>
  );
}
