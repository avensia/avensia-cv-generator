import React from 'react';
import { Poppins } from '@/localfonts';
import Image from 'next/image';
import Link from 'next/link';

const coverUrl = '/assets/images/CoverPhoto-crop.jpg';
const samplePFUrl = '/assets/images/sample-pf.jpg';

type PropsType = {
  cvData: CvData;
};

const CVPreview = ({ cvData }: PropsType) => {
  return (
    <div className={` mx-auto font-poppins ${Poppins.className}`}>
      {/* Header */}
      <div className="relative h-55">
        <Image src={coverUrl} width={2723} height={550} alt="Cover" />
        <Image
          src={samplePFUrl}
          width={2048}
          height={1536}
          alt="Avatar"
          className="w-45 h-45 rounded-full object-cover border-6 border-white shadow absolute right-20 top-25"
        />
      </div>
      <div className="px-10">
        {/* Name */}
        <div>
          <div className="text-3xl font-black mb-3">{cvData?.fullName}</div>
          <div className="text-m font-medium mb-3">{cvData?.position}</div>
          <div className="text-m font-medium mb-3">
            <Link href={`mailto:${cvData?.email}`}>{cvData?.email}</Link>
          </div>
          <div className="text-m font-medium mb-3">{cvData?.phone}</div>
          <div className="text-m font-medium mb-3">
            <Link href={cvData?.linkedIn ? cvData?.linkedIn : ''}>{cvData?.linkedIn}</Link>
          </div>
        </div>
        {/* About */}
        <div className="mb-10">
          <h2 className="text-xl font-black mb-5">About</h2>
          <p>{cvData?.about}</p>
        </div>
        {/* Work Experienct */}
        <div className="mb-10">
          <h2 className="text-xl font-black mb-5">Work Experience</h2>
          <div>
            {cvData?.projects?.map((project, idx) => {
              return (
                <div key={`${idx}-${project.title}`} className="mb-10">
                  <div className="text-[#05afc9] text-xl font-black mb-2">{project.title}</div>
                  <div className="flex items-center justify-between w-100 mb-2">
                    <div className="text-l font-bold">Position Here</div>
                    <div className="text-[#6b7280] text-xs">{project.date}</div>
                  </div>
                  <div>
                    <p>{project.projectDetails}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Skills */}
        <div className="mb-10">
          <h2 className="text-xl font-black mb-5">Skills</h2>

          <ul className="list-disc ml-5">
            {cvData?.technologies?.map((tech, idx) => {
              return <li key={`${tech}-${idx}`}>{tech}</li>;
            })}
          </ul>
        </div>
        {/* Certificate */}
        <div className="mb-10">
          <h2 className="text-xl font-black mb-5">Certificate</h2>
          <ul className="list-disc ml-5">
            <li>Commercetools</li>
            <li>Commercetools</li>
            <li>Commercetools</li>
            <li>Commercetools</li>
            <li>Commercetools</li>
            <li>Commercetools</li>
            <li>Commercetools</li>
          </ul>
        </div>
        {/* Education */}
        <div className="mb-10">
          <h2 className="text-xl font-black mb-5">Educations</h2>
          {cvData?.education?.map((edu, idx) => {
            return (
              <div key={`${edu}-${idx}`} className="mb-5">
                <div>
                  <div className="flex items-center justify-between  mb-2">
                    <div className="font-black">{edu.degree}</div>
                    <div className="font-black">{edu.date}</div>
                  </div>
                  <div className="text-m">{edu.degree}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CVPreview;
