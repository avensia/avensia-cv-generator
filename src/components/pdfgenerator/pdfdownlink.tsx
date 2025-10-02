'use client';

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CreatePDF } from '.';

type PropsType = {
  cvData?: CvData;
};

const Pdfdownlink = (props: PropsType) => {
  return (
    <div>
      <PDFDownloadLink
        document={<CreatePDF formData={props.cvData} />}
        fileName={`${props.cvData?.fullName}Avensia-CV.pdf`}
        style={{ textDecoration: 'none', color: 'blue' }}
      >
        {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
      </PDFDownloadLink>
    </div>
  );
};

export default Pdfdownlink;
