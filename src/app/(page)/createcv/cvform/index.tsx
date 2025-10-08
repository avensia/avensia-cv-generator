'use client';

import React, { useEffect, useState } from 'react';
import { ObjectId } from 'mongodb';
import { CvWithId, useCv } from '../useCv';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/lib/auth';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import ProfilePicture from './components/profilepicture';

export default function CVFormPage({ form }: { form: CvWithId }) {
  const router = useRouter();

  const handleGeneratePDF = () => {
    router.push('/previewcv', undefined);
  };

  return (
    <div>
      <div className="w-full">
        <h1 className="text-2xl font-bold w-full flext text-center mb-6">Avensia CV Form</h1>
        <div className="flex justify-start w-full gap-5">
          <Button variant="secondary" onClick={handleGeneratePDF} className="w-50" disabled={!form._id}>
            Generate CV as PDF
          </Button>
          <form action={logout}>
            <Button variant="secondary" className="mb-5" type="submit">
              Logout
            </Button>
          </form>
        </div>
      </div>
      <div className="p-5 shadow-xl/30 inset-shadow-xs">
        <CVForm initialData={form} />
      </div>
    </div>
  );
}

//const blankWork = (): WorkExperience => ({ title: '', company: '', date: '' });
const blankEdu = (): Education => ({ degree: '', institution: '', date: '' });
const blankProj = (): Project => ({ title: '', date: '', projectDetails: '' });

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
        />
        {form.projects.length === 0 && (
          <p className="text-sm text-gray-500">No entries yet. Click &quot;Add Project&quot; to create one.</p>
        )}
        {form.projects.map((pr, i) => (
          <div key={`pr-${i}`} className="space-y-2 rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Project #{i + 1}</p>
              <RemoveButton onClick={() => removeArrayItem('projects', i)} />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Input
                className="rounded-xl border px-3 py-2"
                placeholder="Title"
                value={pr.title}
                onChange={e => updateArrayItem('projects', i, { title: e.target.value })}
              />
              <Input
                className="rounded-xl border px-3 py-2"
                placeholder="Date"
                value={pr.date}
                onChange={e => updateArrayItem('projects', i, { date: e.target.value })}
              />
            </div>
            <Textarea
              className="w-full rounded-xl border px-3 py-2"
              placeholder="Project details"
              rows={3}
              value={pr.projectDetails}
              onChange={e => updateArrayItem('projects', i, { projectDetails: e.target.value })}
            />
          </div>
        ))}
      </div>
      <Separator />
      {/* Education */}
      <div className="space-y-3">
        <SectionHeader title="Education" onAdd={() => addArrayItem('education', blankEdu)} addLabel="Add Education" />
        {form.education.length === 0 && (
          <p className="text-sm text-gray-500">No entries yet. Click &quot;Add Education&quot; to create one.</p>
        )}
        {form.education.map((ed, i) => (
          <div key={`ed-${i}`} className="space-y-2 rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Education #{i + 1}</p>
              <RemoveButton onClick={() => removeArrayItem('education', i)} />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Input
                className="rounded-xl border px-3 py-2"
                placeholder="Degree"
                value={ed.degree}
                onChange={e => updateArrayItem('education', i, { degree: e.target.value })}
              />
              <Input
                className="rounded-xl border px-3 py-2"
                placeholder="Institution"
                value={ed.institution}
                onChange={e => updateArrayItem('education', i, { institution: e.target.value })}
              />
              <Input
                className="rounded-xl border px-3 py-2"
                placeholder="Date"
                value={ed.date}
                onChange={e => updateArrayItem('education', i, { date: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
      <Separator />
      {/* Technologies */}
      <div className="space-y-3">
        <SectionHeader title="Skillset" onAdd={addTechnology} addLabel="Add Skillset" />
        {form.technologies.length === 0 && (
          <p className="text-sm text-gray-500">No entries yet. Click &quot;Add Skillset&quot; to create one.</p>
        )}
        <div className="space-y-2">
          {form.technologies.map((tech, i) => (
            <div key={`tech-${i}`} className="flex items-center gap-3">
              <Input
                className="flex-1 rounded-xl border px-3 py-2"
                placeholder={`Skill #${i + 1}`}
                value={tech}
                onChange={e => updateTechnology(i, e.target.value)}
              />
              <RemoveButton onClick={() => removeTechnology(i)} />
            </div>
          ))}
        </div>
      </div>
      {/* Certificates */}
      <div className="space-y-3">
        <SectionHeader title="Certificates" onAdd={addCertificates} addLabel="Add Certificates" />
        {form.technologies.length === 0 && (
          <p className="text-sm text-gray-500">No entries yet. Click &quot;Add Certificates&quot; to create one.</p>
        )}
        <div className="space-y-2">
          {form?.certificates?.map((cert, i) => (
            <div key={`cert-${i}`} className="flex items-center gap-3">
              <Input
                className="flex-1 rounded-xl border px-3 py-2"
                placeholder={`Certificates #${i + 1}`}
                value={cert}
                onChange={e => updateCertificates(i, e.target.value)}
              />
              <RemoveButton onClick={() => removeCertificates(i)} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <Button type="submit" className="w-1/6  px-4 py-3  shadow-sm">
          {cvId ? 'Save CV' : 'Save CV'}
        </Button>
      </div>
    </form>
  );
}
