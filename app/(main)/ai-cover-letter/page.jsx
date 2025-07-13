"use server";

import { getCoverLetters } from '@/actions/cover-letter';
import { Button } from '@/components/ui/button';
import { Plus, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import CoverLetterList from './_components/cover-letter-list';

const CoverLetterPage = async () => {
    const coverLetters = await getCoverLetters();

  return (
    <div className='px-5'>
        <div className='flex flex-row md:flex-row gap-2 items-center justify-between md-5'>
            <h1 className='font-bold gradient-title text-5xl'>
                Cover Letter
            </h1>

            <Link href='/ai-cover-letter/create'>
                <Button className='cursor-pointer'>
                    <PlusCircle className='h-4 w-4 mr-2' />
                    Create New
                </Button>
            </Link>
        </div>

        <CoverLetterList coverLetters={coverLetters} />
    </div>
  )
}

export default CoverLetterPage;