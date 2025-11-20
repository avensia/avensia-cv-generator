// ---------------- Types ----------------
type Education = { degree: string; institution: string; date: string };
type Project = { title: string; role: string; date: string; projectDetails: string };
type WorkExperience = { company: string; role: string; date: string; workDetails: string };

type CvDataDbModel = {
  CvID: string;
  FullName: string;
  ImgDataUrl: string;
  ImgVersion: string;
  Position: string;
  Email: string;
  LinkedIn: string;
  Phone: string;
  About: string;
  Education: Education[];
  Projects: Project[];
  WorkExperience: WorkExperience[];
  Skills: string[];
  Certificates: string[];
};

type CvData = {
  cvId: string;
  fullName: string;
  imgDataUrl: string;
  imgVersion: string;
  position: string;
  email: string;
  linkedIn: string;
  phone: string;
  about: string;
  education: Education[];
  projects: Project[];
  workExperience: WorkExperience[];
  skills: string[];
  certificates: string[];
};
