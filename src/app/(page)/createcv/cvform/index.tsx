'use client';

import { ObjectId } from 'mongodb';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { CvWithId, useCv } from '../useCv';
// ^ adjust the import path

export default function CVFormPage({ form }: { form: CvWithId }) {
  return (
    <main className="min-h-screen w-full bg-gray-50 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight mb-6">CV Form (Repeatable Sections)</h1>
        <CVForm initialData={form} />
      </div>
    </main>
  );
}

const blankWork = (): WorkExperience => ({ title: '', company: '', date: '' });
const blankEdu = (): Education => ({ degree: '', institution: '', date: '' });
const blankProj = (): Project => ({ title: '', company: '', date: '', projectDetails: '' });

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

  const [form, setForm] = useState<CvData>(initialData);
  const [cvId, setCvId] = useState<string>(initialData._id?.toString() ?? '');

  // if your initialData might change (e.g., client nav), keep cvId in sync
  useEffect(() => {
    if (initialData?._id) setCvId(initialData._id.toString());
  }, [initialData?._id]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof CvData, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const updateArrayItem = <T,>(key: keyof CvData, idx: number, patch: Partial<T>) => {
    setForm(prev => {
      const next = structuredClone(prev) as CvData;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      next[key][idx] = { ...next[key][idx], ...patch };
      return next;
    });
  };

  const addArrayItem = <T,>(key: keyof CvData, factory: () => T) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setForm(prev => ({ ...prev, [key]: [...(prev[key] as any[]), factory()] } as CvData));
  };

  const removeArrayItem = (key: keyof CvData, idx: number) => {
    setForm(prev => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const copy = [...(prev[key] as any[])];
      copy.splice(idx, 1);
      return { ...prev, [key]: copy } as CvData;
    });
  };

  const addTechnology = () => addArrayItem<string>('technologies', () => '');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateTechnology = (idx: number, value: string) => updateArrayItem<string>('technologies', idx, value as any);
  const removeTechnology = (idx: number) => removeArrayItem('technologies', idx);

  const onUploadImage = (file: File | null) => {
    if (!file) return handleChange('imgDataUrl', '');
    const reader = new FileReader();
    reader.onload = () => handleChange('imgDataUrl', reader.result as string);
    reader.readAsDataURL(file);
  };

  // 🧠 SUBMIT — use the hook’s unified create/update
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { id } = await saveCv(form); // <-- the hook decides create vs update
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
        <div className="space-y-3">
          <label className="block text-sm font-medium">Photo</label>
          <div className="flex items-start gap-4">
            {form.imgDataUrl ? (
              <Image src={form.imgDataUrl} alt="Profile" className="h-24 w-24 rounded-xl object-cover border" />
            ) : (
              <div className="h-24 w-24 rounded-xl border bg-gray-100" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={e => onUploadImage(e.currentTarget.files?.[0] ?? null)}
              className="flex-1 rounded-xl border px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* About */}
      <div>
        <label className="block text-sm font-medium">About</label>
        <textarea
          value={form.about}
          onChange={e => handleChange('about', e.target.value)}
          className="w-full rounded-xl border px-3 py-2"
          rows={4}
        />
      </div>

      {/* Work Experience */}
      <div className="space-y-3">
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
                onChange={e => updateArrayItem<WorkExperience>('workExperience', i, { title: e.target.value })}
              />
              <input
                className="rounded-xl border px-3 py-2"
                placeholder="Company"
                value={we.company}
                onChange={e => updateArrayItem<WorkExperience>('workExperience', i, { company: e.target.value })}
              />
              <input
                className="rounded-xl border px-3 py-2"
                placeholder="Date"
                value={we.date}
                onChange={e => updateArrayItem<WorkExperience>('workExperience', i, { date: e.target.value })}
              />
            </div>
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
                onChange={e => updateArrayItem<Education>('education', i, { degree: e.target.value })}
              />
              <input
                className="rounded-xl border px-3 py-2"
                placeholder="Institution"
                value={ed.institution}
                onChange={e => updateArrayItem<Education>('education', i, { institution: e.target.value })}
              />
              <input
                className="rounded-xl border px-3 py-2"
                placeholder="Date"
                value={ed.date}
                onChange={e => updateArrayItem<Education>('education', i, { date: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className="space-y-3">
        <SectionHeader title="Projects" onAdd={() => addArrayItem('projects', blankProj)} addLabel="Add Project" />
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
                onChange={e => updateArrayItem<Project>('projects', i, { title: e.target.value })}
              />
              <input
                className="rounded-xl border px-3 py-2"
                placeholder="Company"
                value={pr.company}
                onChange={e => updateArrayItem<Project>('projects', i, { company: e.target.value })}
              />
              <input
                className="rounded-xl border px-3 py-2"
                placeholder="Date"
                value={pr.date}
                onChange={e => updateArrayItem<Project>('projects', i, { date: e.target.value })}
              />
            </div>
            <textarea
              className="w-full rounded-xl border px-3 py-2"
              placeholder="Project details"
              rows={3}
              value={pr.projectDetails}
              onChange={e => updateArrayItem<Project>('projects', i, { projectDetails: e.target.value })}
            />
          </div>
        ))}
      </div>

      {/* Technologies */}
      <div className="space-y-3">
        <SectionHeader title="Technologies" onAdd={addTechnology} addLabel="Add Technology" />
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

      <button
        type="submit"
        className="w-full rounded-2xl border bg-gray-900 px-4 py-3 text-white shadow-sm hover:bg-gray-800"
      >
        {cvId ? 'Update CV' : 'Save CV'}
      </button>
    </form>
  );
}
