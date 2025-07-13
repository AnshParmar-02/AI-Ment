import { getCoverLetterById } from '@/actions/cover-letter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import CoverLetterPreview from '../_components/cover-letter-preview';

const EditCoverLetterPage = async ({ params }) => {

    const { id } = await params;
    if (!id) {
        throw new Error("Missing cover letter ID in params");
    }
    const coverLetter = await getCoverLetterById(id);
    
  return (
    <div className='container mx-auto py-6 px-5'>
        <div className='flex flex-col space-y-2'>
            <Link href='/ai-cover-letter'>
                <Button className='gap-2 pl-0' variant='link'>
                    <ArrowLeft className='h-4 w-4' />
                    Back to cover letter
                </Button>
            </Link>

            <h1 className='text-6xl font-bold gradient-title mb-6'>
                {coverLetter?.jobTitle} at {coverLetter?.companyName}
            </h1>
        </div>

        <CoverLetterPreview content={coverLetter?.content} />
    </div>
  )
}

export default EditCoverLetterPage;