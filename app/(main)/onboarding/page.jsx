import React from 'react'
import { industries } from '@/data/industries.js';
import OnbordingForm from '@/app/(main)/onboarding/_components/onboarding-form';
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';

const OnboardingPage = async () => {
    //check if user is alreaady onboarded
    const { isOnboarded } = await getUserOnboardingStatus();

    if (isOnboarded) {
        redirect('/dashboard');
    }

  return (
    <main>
      <OnbordingForm industries={industries} />
    </main>
  )
}

export default OnboardingPage;