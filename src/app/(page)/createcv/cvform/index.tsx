'use client';

import React, { useEffect, useState } from 'react';
import { ObjectId } from 'mongodb';
import Image from 'next/image';
import { CvWithId, useCv } from '../useCv';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/lib/auth';

export default function CVFormPage({ form }: { form: CvWithId }) {
  const router = useRouter();

  const handleGeneratePDF = () => {
    router.push('/previewcv', undefined);
  };

  return (
    <main className="min-h-screen w-full bg-gray-50 py-10">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex justify-between w-full">
          <h1 className="text-2xl font-semibold tracking-tight mb-6">Avensia CV Form</h1>
          <div className="flex justify-end w-full gap-5">
            <Button onClick={handleGeneratePDF} className="w-50">
              Generate PDF
            </Button>
            <form action={logout}>
              <Button className="mb-5" type="submit">
                Logout
              </Button>
            </form>
          </div>
        </div>
        <CVForm initialData={form} />
      </div>
    </main>
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
        <button type="button" onClick={onAdd} className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50">
          + {addLabel ?? 'Add'}
        </button>
      )}
    </div>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs text-red-700 hover:bg-red-100"
    >
      Remove
    </button>
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

        const res = await fetch('/api/upload', { method: 'POST', body });
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
      <input type="hidden" name="id" value={cvId} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="space-y-3 mb-5">
            <label className="block text-sm font-medium">Photo</label>
            <div className="flex items-start gap-4">
              {form.imgDataUrl ? (
                <Image
                  src={imgPreviewUrl ?? form.imgDataUrl!}
                  width={1000}
                  height={1000}
                  alt="Profile"
                  className="h-24 w-24 rounded-xl object-cover border"
                />
              ) : (
                <div className="h-24 w-24 rounded-xl border bg-gray-100" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={e => onUploadImage(e.currentTarget.files?.[0] ?? null)}
                className="flex-0 w-50  rounded-xl border px-3 py-2"
              />
            </div>
          </div>

          {/* About */}
          <div>
            <label className="block text-sm font-medium">About</label>
            <textarea
              value={form.about}
              onChange={e => handleChange('about', e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
              rows={8}
            />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={e => handleChange('fullName', e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Position</label>
            <input
              type="text"
              value={form.position}
              onChange={e => handleChange('position', e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">LinkedIn</label>
            <input
              type="url"
              value={form.linkedIn}
              onChange={e => handleChange('linkedIn', e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => handleChange('phone', e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Work Experience */}
      {/* <div className="space-y-3">
        <SectionHeader
          title="Work Experience"
          onAdd={() => addArrayItem('workExperience', blankWork)}
          addLabel="Add Role"
        />
        {form.workExperience.length === 0 && (
          <p className="text-sm text-gray-500">No entries yet. Click &quot;Add Role&quot; to create one.</p>
        )}
        {form.workExperience.map((we, i) => (
          <div key={`we-${i}`} className="space-y-2 rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Role #{i + 1}</p>
              <RemoveButton onClick={() => removeArrayItem('workExperience', i)} />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <input
                className="rounded-xl border px-3 py-2"
                placeholder="Title"
                value={we.title}
                onChange={e => updateArrayItem('workExperience', i, { title: e.target.value })}
              />
              <input
                className="rounded-xl border px-3 py-2"
                placeholder="Company"
                value={we.company}
                onChange={e => updateArrayItem('workExperience', i, { company: e.target.value })}
              />
              <input
                className="rounded-xl border px-3 py-2"
                placeholder="Date"
                value={we.date}
                onChange={e => updateArrayItem('workExperience', i, { date: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div> */}

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
              <input
                className="rounded-xl border px-3 py-2"
                placeholder="Title"
                value={pr.title}
                onChange={e => updateArrayItem('projects', i, { title: e.target.value })}
              />
              <input
                className="rounded-xl border px-3 py-2"
                placeholder="Date"
                value={pr.date}
                onChange={e => updateArrayItem('projects', i, { date: e.target.value })}
              />
            </div>
            <textarea
              className="w-full rounded-xl border px-3 py-2"
              placeholder="Project details"
              rows={3}
              value={pr.projectDetails}
              onChange={e => updateArrayItem('projects', i, { projectDetails: e.target.value })}
            />
          </div>
        ))}
      </div>

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
              <input
                className="rounded-xl border px-3 py-2"
                placeholder="Degree"
                value={ed.degree}
                onChange={e => updateArrayItem('education', i, { degree: e.target.value })}
              />
              <input
                className="rounded-xl border px-3 py-2"
                placeholder="Institution"
                value={ed.institution}
                onChange={e => updateArrayItem('education', i, { institution: e.target.value })}
              />
              <input
                className="rounded-xl border px-3 py-2"
                placeholder="Date"
                value={ed.date}
                onChange={e => updateArrayItem('education', i, { date: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Technologies */}
      <div className="space-y-3">
        <SectionHeader title="Skillset" onAdd={addTechnology} addLabel="Add Technology" />
        {form.technologies.length === 0 && (
          <p className="text-sm text-gray-500">No entries yet. Click &quot;Add Technology&quot; to create one.</p>
        )}
        <div className="space-y-2">
          {form.technologies.map((tech, i) => (
            <div key={`tech-${i}`} className="flex items-center gap-3">
              <input
                className="flex-1 rounded-xl border px-3 py-2"
                placeholder={`Technology #${i + 1}`}
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
              <input
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
        <Button type="submit" className="w-1/2  px-4 py-3  shadow-sm">
          {cvId ? 'Update CV' : 'Save CV'}
        </Button>
      </div>
    </form>
  );
}
