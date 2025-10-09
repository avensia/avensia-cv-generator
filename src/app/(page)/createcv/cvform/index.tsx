'use client';

import React, { useEffect, useRef } from 'react';
import { CvWithId } from '../useCv';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import CVForm from './components/cvform';
import { useFormEvents } from './useFormEvents';
import { LogoutAlert } from './components/logout';
import { SaveAlert, SaveAlertHandle } from './components/savealert';

export default function CVFormPage({ initialForm }: { initialForm: CvWithId }) {
  const router = useRouter();
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

  const handleGeneratePDF = () => {
    router.push('/previewcv', undefined);
  };

  useEffect(() => {
    if (isSaveSuccess.status) {
      saveAlertRef.current?.open();
    }
  }, [isSaveSuccess]);

  return (
    <div>
      <div className="w-full">
        <h1 className="text-2xl font-bold w-full flext text-center mb-6">Avensia CV Form</h1>
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
<<<<<<< HEAD
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
=======
        <CVForm initialData={form} />
      </div>
    </div>
  );
}

//const blankWork = (): WorkExperience => ({ title: '', company: '', date: '' });
const blankEdu = (): Education => ({user_id:'', degree: '', institution: '', date: '' });
const blankProj = (): Project => ({user_id: '', title: '', date: '', details:'', projectDetails: '', company: '', role:'', responsibilities:'' });

function SectionHeader({ title, onAdd, addLabel }: { title: string; onAdd?: () => void; addLabel?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      {onAdd && (
        <Button type="button" onClick={onAdd} className="px-3 py-1.5 text-sm">
          {addLabel ?? 'Add'}
        </Button>
      )}
    </div>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="outline" onClick={onClick}>
      Remove
    </Button>
  );
}

function CVForm({ initialData }: { initialData: CvData & { _id?: string | ObjectId } }) {
  // 🔗 Hook: give it your server-provided initial data so there’s no flash
  const { saveCv } = useCv({ initialData });
  // below your other useState hooks
  const [imgPreviewUrl, setImgPreviewUrl] = useState<string | null>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [form, setForm] = useState<CvData>(initialData);
  const [cvId, setCvId] = useState<string>(initialData._id?.toString() ?? '');

  // if your initialData might change (e.g., client nav), keep cvId in sync
  useEffect(() => {
    if (initialData?._id) setCvId(initialData._id.toString());
  }, [initialData?._id]);

  useEffect(() => {
    return () => {
      if (imgPreviewUrl) URL.revokeObjectURL(imgPreviewUrl);
    };
  }, [imgPreviewUrl]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof CvData, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const updateArrayItem = <T,>(key: keyof CvData, idx: number, patch: T) => {
    setForm(prev => {
      const next = structuredClone(prev) as CvData;

      if (typeof next[key][idx] === 'string') {
        // Replace string directly
        (next[key] as unknown as string[])[idx] = patch as unknown as string;
      } else {
        // Merge object
        (next[key] as T[])[idx] = { ...next[key][idx], ...patch };
      }

      return next;
    });
  };

  // Add one item to an array field on CvData.
  // If the key doesn't exist yet, it will be created as an array with the new item.
  const addArrayItem = <K extends keyof CvData>(key: K, factory: () => CvData[K] extends (infer U)[] ? U : never) => {
    setForm(prev => {
      const current = prev[key] as unknown as unknown[];
      const safe = Array.isArray(current) ? current : []; // create if missing/invalid
      return {
        ...prev,
        [key]: [...safe, factory()] as unknown as CvData[K],
      };
    });
  };

  const removeArrayItem = (key: keyof CvData, idx: number) => {
    setForm(prev => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const copy = [...(prev[key] as any[])];
      copy.splice(idx, 1);
      return { ...prev, [key]: copy } as CvData;
    });
  };

  const addTechnology = () => addArrayItem('technologies', () => '');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateTechnology = (idx: number, value: string) => updateArrayItem<string>('technologies', idx, value as any);
  const removeTechnology = (idx: number) => removeArrayItem('technologies', idx);

  const addCertificates = () => addArrayItem('certificates', () => '');
  const updateCertificates = (idx: number, value: string) => updateArrayItem<string>('certificates', idx, value);
  const removeCertificates = (idx: number) => removeArrayItem('certificates', idx);

  const onUploadImage = (file: File | null) => {
    if (!file) {
      setImgFile(null);
      if (imgPreviewUrl) URL.revokeObjectURL(imgPreviewUrl);
      setImgPreviewUrl(null);
      handleChange('imgDataUrl', ''); // clear persisted URL
      return;
    }

    const url = URL.createObjectURL(file);
    if (imgPreviewUrl) URL.revokeObjectURL(imgPreviewUrl);

    setImgFile(file);
    setImgPreviewUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let imgUrl = form.imgDataUrl;

      // only upload if user selected a new file
      if (imgFile) {
        const body = new FormData();
        body.append('file', imgFile);

        const res = await fetch('/api/blob-upload', { method: 'POST', body });
        if (!res.ok) throw new Error('Image upload failed');
        const data = await res.json();
        imgUrl = data.url;
      }

      const payload = { ...form, imgDataUrl: imgUrl };
      const { id } = await saveCv(payload);

      if (!cvId) setCvId(id);
      alert(cvId ? `Updated CV ${id}` : `Created CV ${id}`);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Unexpected error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <Input type="hidden" name="id" value={cvId} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <ProfilePicture form={form} onUploadImage={onUploadImage} />
          {/* About */}
          <div>
            <Label className="block text-sm font-medium">About</Label>
            <Textarea
              value={form.about}
              onChange={e => handleChange('about', e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
              rows={8}
            />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <Label className="block text-sm font-medium">Full Name</Label>
            <Input type="text" value={form.fullName} onChange={e => handleChange('fullName', e.target.value)} />
          </div>
          <div>
            <Label className="block text-sm font-medium">Position</Label>
            <Input type="text" value={form.position} onChange={e => handleChange('position', e.target.value)} />
          </div>
          <div>
            <Label className="block text-sm font-medium">Email</Label>
            <Input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} />
          </div>
          <div>
            <Label className="block text-sm font-medium">LinkedIn</Label>
            <Input type="url" value={form.linkedIn} onChange={e => handleChange('linkedIn', e.target.value)} />
          </div>
          <div>
            <Label className="block text-sm font-medium">Phone</Label>
            <Input type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
          </div>
        </div>
      </div>
      <Separator />
      {/* Projects */}
      <div className="space-y-3">
        <SectionHeader
          title="Avensia Projects"
          onAdd={() => addArrayItem('projects', blankProj)}
          addLabel="Add Project"
>>>>>>> f230ddc (modified file directories)
        />
      </div>
    </div>
  );
}
