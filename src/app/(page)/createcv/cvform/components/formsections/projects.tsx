import React, { FunctionComponent } from 'react';
import { FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { blankProj, RemoveButton, SectionHeader } from '../cvform';

type PropsType = {
  projects: Project[];
  addArrayItem: <K extends keyof CvData>(key: K, factory: () => CvData[K] extends (infer U)[] ? U : never) => void;
  removeArrayItem: (key: keyof CvData, idx: number) => void;
  updateArrayItem: <T>(key: keyof CvData, idx: number, patch: T) => void;
};

const Projects: FunctionComponent<PropsType> = ({ projects, addArrayItem, removeArrayItem, updateArrayItem }) => {
  return (
    <div className="space-y-3">
      <SectionHeader
        title="Avensia Projects"
        onAdd={() => addArrayItem('projects', blankProj)}
        addLabel="Add Project"
      />
      {projects.length === 0 && (
        <p className="text-sm text-gray-500">No entries yet. Click &quot;Add Project&quot; to create one.</p>
      )}
      {projects.map((pr, i) => (
        <FieldSet key={`pr-${i}`}>
          <div className="space-y-2 rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Project</p>
              <RemoveButton onClick={() => removeArrayItem('projects', i)} />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <FieldGroup className="mb-3">
                <FieldLabel htmlFor={`project-title-${i}`}>Title</FieldLabel>
                <Input
                  id={`project-title-${i}`}
                  className="rounded-xl border px-3 py-2"
                  placeholder="Title"
                  value={pr.title}
                  onChange={e => updateArrayItem('projects', i, { title: e.target.value })}
                />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel htmlFor={`project-date-${i}`}>Date</FieldLabel>
                <Input
                  id={`project-date-${i}`}
                  className="rounded-xl border px-3 py-2"
                  placeholder="Date"
                  value={pr.date}
                  onChange={e => updateArrayItem('projects', i, { date: e.target.value })}
                />
              </FieldGroup>
            </div>
            <FieldGroup>
              <FieldLabel htmlFor={`project-details-${i}`}>Project Details</FieldLabel>
              <Textarea
                id={`project-details-${i}`}
                className="w-full rounded-xl border px-3 py-2"
                placeholder="Project details"
                rows={3}
                value={pr.projectDetails}
                onChange={e => updateArrayItem('projects', i, { projectDetails: e.target.value })}
              />
            </FieldGroup>
          </div>
        </FieldSet>
      ))}
    </div>
  );
};

export default Projects;
