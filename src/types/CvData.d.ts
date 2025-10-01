// ---------------- Types ----------------
type WorkExperience = { title: string; company: string; date: string };
type Education = { degree: string; institution: string; date: string };
type Project = { title: string; company: string; date: string; projectDetails: string };

type CvData = {
  fullName: string;
  imgDataUrl: string;
  position: string;
  email: string;
  linkedIn: string;
  phone: string;
  about: string;
  workExperience: WorkExperience[];
  education: Education[];
  projects: Project[];
  technologies: string[];
};
