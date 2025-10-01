import { Poppins } from '@/localfonts';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const coverUrl = '/assets/images/CoverPhoto-crop.jpg';
const samplePFUrl = '/assets/images/sample-pf.jpg';

const CVPreview = () => {
  return (
    <div className={`w-200 mx-auto font-poppins ${Poppins.className}`}>
      {/* Header */}
      <div className="relative h-60">
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
          <div className="text-3xl font-black mb-5">Consorcio Golosino</div>
          <div className="text-lg font-medium mb-5">Frontend Developer</div>
          <div className="text-lg font-medium mb-5">
            <Link href={'mailtto:consgolosino21@gmail.com'}>consgolosino21@gmail.com</Link>
          </div>
          <div className="text-lg font-medium mb-5">097600021042</div>
          <div className="text-lg font-medium mb-5">
            <Link href={'https://www.linkedin.com/in/consorcio-golosino-jr-79a75327/'}>
              https://www.linkedin.com/in/consorcio-golosino-jr-79a75327/
            </Link>
          </div>
        </div>
        {/* About */}
        <div className="mb-10">
          <h2 className="text-xl font-black mb-5">About</h2>
          <p>
            Passionate software engineer with 5 years of experience in developing scalable web applications and working
            across the full stack.
          </p>
        </div>
        {/* Work Experienct */}
        <div>
          <h2 className="text-xl font-black mb-5">Work Experienct</h2>
        </div>
      </div>
    </div>
  );
};

export default CVPreview;
