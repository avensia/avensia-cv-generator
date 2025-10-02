// Seed Data (replace with import if needed)
export const CVFormData: CvData = {
  fullName: 'John Doe',
  imgDataUrl: '',
  position: 'Software Engineer',
  email: '',
  linkedIn: '',
  phone: '',
  about:
    'Passionate software engineer with 5 years of experience in developing scalable web applications and working across the full stack.',

  education: [{ degree: 'B.Sc. in Computer Science', institution: 'State University', date: '2015 - 2019' }],
  projects: [
    {
      title: 'E-commerce Platform',
      date: '2021 - 2022',
      projectDetails:
        'Developed a full-featured e-commerce platform using React and Node.js, integrating payment gateways and user authentication.',
    },
  ],
  technologies: [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'Django',
    'SQL',
    'NoSQL',
    'Docker',
    'Kubernetes',
  ],
  certificates: ['Commercetools', 'Optimizely'],
};
