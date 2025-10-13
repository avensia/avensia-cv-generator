'use client';

import React, { useEffect, useRef } from 'react';
import { CvWithId } from '../useCv';
import { Button } from '@/components/ui/button';
import CVForm from './components/cvform';
import { useFormEvents } from './useFormEvents';
import { LogoutAlert } from './components/logout';
import { SaveAlert, SaveAlertHandle } from './components/savealert';
import { useIsUpdated } from './useIsUpdated';
import { useUnsavedChangesPrompt } from './useUnsavedChangesPrompt';
import { UnsavedChangesModal } from './components/unsavedchangesmodal';

export default function CVFormPage({ initialForm }: { initialForm: CvWithId }) {
  const saveAlertRef = useRef<SaveAlertHandle>(null);
  const {
    cvId,
    setCvId,
    formState,
    setFormState,
    imgPreviewUrl,
    setImgPreviewUrl,
    setImgFile,
    handleChange,
    handleSubmit,
    isSaveSuccess,
  } = useFormEvents(initialForm);

  const { isUpdated, initialSnapshot } = useIsUpdated<CvData>(formState, initialForm);

  const handleGeneratePDF = () => {
    attemptNavigate('/previewcv');
  };

  const handleDiscard = () => {
    setFormState(initialSnapshot);
  };

  useEffect(() => {
    if (isSaveSuccess.status) {
      saveAlertRef.current?.open();
    }
  }, [isSaveSuccess]);

  const { open, attemptNavigate, confirmDiscard, cancelStay, confirmSave } = useUnsavedChangesPrompt(isUpdated, {
    onSave: handleSubmit,
    onDiscard: handleDiscard,
  });

  return (
    <div>
      <div className="w-full">
        <h1 className="text-2xl font-bold w-full flext text-center mb-6">Avensia CV Form</h1>
        <UnsavedChangesModal
          confirmSave={confirmSave}
          confirmDiscard={confirmDiscard}
          cancelStay={cancelStay}
          isOpen={open}
        />
        <SaveAlert isSaveSuccess={isSaveSuccess} ref={saveAlertRef} />
        <div className="flex justify-start w-full gap-5">
          <Button onClick={handleSubmit} type="submit" className="w-1/6  px-4 py-3  shadow-sm">
            Save CV
          </Button>
          <Button variant="secondary" onClick={handleGeneratePDF} className="w-50" disabled={!initialForm._id}>
            Generate CV as PDF
          </Button>
          <LogoutAlert />
        </div>
      </div>
      <div className="p-5 shadow-xl/30 inset-shadow-xs">
        <CVForm
          formState={formState}
          cvId={cvId}
          setCvId={setCvId}
          initialData={initialForm}
          imgPreviewUrl={imgPreviewUrl}
          setImgFile={setImgFile}
          setImgPreviewUrl={setImgPreviewUrl}
          setFormState={setFormState}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
