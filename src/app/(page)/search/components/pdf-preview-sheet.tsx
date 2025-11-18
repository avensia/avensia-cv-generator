import ClientPdfViewer from '@/components/pdfgenerator/createpdfclient';
import Pdfdownlink from '@/components/pdfgenerator/pdfdownlink';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import React from 'react';

type PropsType = {
  cvData: CvData;
};

const PdfPreviewSheet = ({ cvData }: PropsType) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="sm" className="w-full">
          Preview Cv
        </Button>
      </SheetTrigger>
      <SheetContent className="w-4xl">
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription>
            <div className="mb-5">
              <Pdfdownlink cvData={cvData} />
            </div>
            <ClientPdfViewer cvData={cvData} className="h-[85vh]" />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default PdfPreviewSheet;
