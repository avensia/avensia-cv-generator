'use client';

import React from 'react';
import { Document, Page, StyleSheet, View, Font } from '@react-pdf/renderer';
import { Heading } from './heading';
import Name from './name';
import Section from './section';
import About from './aboutme';
import WorkExperience from './workexperience';
import Skills from './skills';
import Certificates from './certificates';
import Education from './education';

const coverUrl = '/assets/images/CoverPhoto-crop.jpg';
const samplePFUrl = '/assets/images/sample-pf.jpg';

Font.register({
  family: 'Poppins',
  fonts: [{ src: '/assets/fonts/regular.ttf' }, { src: '/assets/fonts/bold.ttf', fontWeight: 'bold' }],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Poppins',
    display: 'flex',
    fontSize: 12,
  },
  layout: {
    marginLeft: 36,
    marginRight: 36,
    marginTop: -50,
  },
  container: {
    display: 'flex',
  },
  name: {
    fontSize: 24,
    paddingLeft: 32,
    paddingRight: 32,
  },
  role: {
    fontSize: 12,
    paddingLeft: 32,
    paddingRight: 32,
  },
  h4: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingBottom: 0,
  },
});

export const CreatePDF = ({ formData }: { formData?: CvData }) => {
  console.log({ formData });
  return (
    <Document>
      <Page style={styles.page} orientation={'portrait'}>
        <View style={{ height: 200 }}>
          <Heading
            coverUrl={coverUrl ?? ''}
            samplePFUrl={formData?.imgDataUrl ? formData?.imgDataUrl : samplePFUrl}
            PFurl={formData?.imgDataUrl}
          />
        </View>
        <View style={styles.layout}>
          <Name formData={formData} />
          <Section title="About" hr={false} wrap={false}>
            <About aboutMe={formData?.about} />
          </Section>
          <Section title="Work Experience" hr={false} wrap={false}>
            <WorkExperience projects={formData?.projects} />
          </Section>
          <Section title="Skills" hr={false} wrap={false}>
            <Skills skills={formData?.technologies} />
          </Section>
          <Section title="Certificates" hr={false} wrap={false}>
            <Certificates />
          </Section>
          <Section title="Educations" hr={false}>
            <Education educations={formData?.education} />
          </Section>
        </View>
      </Page>
    </Document>
  );
};
