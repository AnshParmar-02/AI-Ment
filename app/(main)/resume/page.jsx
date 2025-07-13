import { getResume } from '@/actions/resume';
import React from 'react';
import ResumeBuilder from './_components/resume-builder';

const ResumePage = async () => {

    const resume = await getResume();
    const initialContent = typeof resume.content === 'string' ? resume.content : "";

  return (
    <div className='container mx-auto py-6'>
        <ResumeBuilder initialContent={initialContent} />
    </div>
  )
}

export default ResumePage;