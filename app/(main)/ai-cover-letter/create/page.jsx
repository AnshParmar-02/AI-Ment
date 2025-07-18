export const dynamic = "force-dynamic";

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import CoverLetterGenerator from '../_components/cover-letter-generate';

const NewCoverLetter = () => {
  return (
    <div className='container mx-auto py-6 px-5'>
        <div className='flex flex-col space-y-2'>
            <Link href='/ai-cover-letter'>
                <Button variant='link' className='gap-2 pl-0 cursor-pointer'>
                    <ArrowLeft className='h-4 w-4' />
                    Back to Cover Letter
                </Button>
            </Link>

            <div className='pb-6'>
                <h1 className='text-6xl font-bold gradient-title'>
                    Create Cover Letter
                </h1>
                <p className='text-muted-foreground'>
                    Generate a cover letter for your job application
                </p>
            </div>
        </div>

        <CoverLetterGenerator />
    </div>
  )
}

export default NewCoverLetter;