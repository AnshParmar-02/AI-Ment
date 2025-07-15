import { getResume } from '@/actions/resume';
import React from 'react';
import ResumeBuilder from './_components/resume-builder';
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';

const ResumePage = async () => {

  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) {
    redirect("/onboarding");
  }

    const resume = await getResume();
    const initialContent = resume?.content ?? "";

  return (
    <div className='container mx-auto py-6'>
        <ResumeBuilder initialContent={initialContent} />
    </div>
  )
}

export default ResumePage;