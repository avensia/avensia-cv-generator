function parseJSON<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value !== 'string') return (value as T) ?? fallback; // if already parsed
  try {
    const v = JSON.parse(value);
    return (v ?? fallback) as T;
  } catch {
    return fallback;
  }
}

export function hydrateCv(row: CvDataDbModel): CvData {
  return {
    cvId: row.CvID,
    fullName: row.FullName,
    imgDataUrl: row.ImgDataUrl,
    position: row.Position,
    email: row.Email,
    linkedIn: row.LinkedIn,
    phone: row.Phone,
    about: row.About,
    education: parseJSON<Education[]>(row.Education, []),
    projects: parseJSON<Project[]>(row.Projects, []),
    workExperience: parseJSON<WorkExperience[]>(row.WorkExperience, []),
    skills: parseJSON<string[]>(row.Skills, []),
    certificates: parseJSON<string[]>(row.Certificates, []),
  };
}
