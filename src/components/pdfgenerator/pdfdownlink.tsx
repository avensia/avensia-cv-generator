'use client';

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CreatePDF } from '.';
import { Button } from '../ui/button';
import { FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type PropsType = {
  cvData?: CvData;
  className?: string;
};

const Pdfdownlink = (props: PropsType) => {
  return (
    <div>
      <PDFDownloadLink
        document={<CreatePDF formData={props.cvData} />}
        fileName={`${props.cvData?.fullName}Avensia-CV.pdf`}
        style={{ textDecoration: 'none', color: 'blue' }}
        className={cn(props.className)}
      >
        {({ loading }) => (
          <Button variant="secondary">
            <FileDown />
            {loading ? 'Generating CV...' : 'Download CV as PDF'}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default Pdfdownlink;
