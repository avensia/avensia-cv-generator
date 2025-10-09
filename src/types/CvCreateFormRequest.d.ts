// type WorkExperienceReq = { title: string; company: string; date: string };
// type Education = { degree: string; institution: string; date: string };
// type Project = { title: string; date: string; projectDetails: string };
// ---------------- Types ----------------

type CvCreateFormRequest = {
  fullName: string;
  imgDataUrl: string;
  position: string;
  email: string;
  linkedIn: string;
  phone: string;
  about: string;
  education: Education[];
  projects: Project[];
  workExperience: WorkExperience[];
  technologies: string[];
  certificates: string[];
};
