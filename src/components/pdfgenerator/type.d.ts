type CVFormData = {
  formData?: CvData;
};

type CVFormProjectsData = {
  projects?: WorkExperienceOrProject[];
};

type CVFormEducationData = {
  educations?: { degree: string; institution: string; date: string }[];
};
