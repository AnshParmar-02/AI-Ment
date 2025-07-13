"use client";

import { deleteCoverLetter } from '@/actions/cover-letter';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogFooter, AlertDialogHeader, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const CoverLetterList = ({ coverLetters }) => {
    const router = useRouter();

    const handleDelete = async (id) => {
        try {
            const result = await deleteCoverLetter(id);
            if(result.success) {
              toast.success("Cover Letter deleted successfully.");
              router.refresh();
            }
        } catch (error) {
            toast.error(error.message || "Failed to delete cover letter")
        }
    }

    if(!coverLetters?.length) {
        return (
            <Card>
                <CardHeader>
                  <CardTitle>No Cover Letters Yet</CardTitle>
                  <CardDescription>
                    Create your first cover letter to get started
                  </CardDescription>
                </CardHeader>
            </Card>
        )
    }

  return (
    <div className='space-y-4'>
        {coverLetters.map((letter) => (
            <Card key={letter._id} className='group relative'>
              <CardHeader>
                <div className='flex items-start justify-between'>
                    <div>
                        <CardTitle className='text-xl gradient-title'>
                            {letter.jobTitle} at {letter.companyName}
                        </CardTitle>
                        <CardDescription>
                            Created {format(new Date(letter.createdAt), "PPP")}
                        </CardDescription>
                    </div>

                    <div className='space-x-2'>
                        <AlertDialog>
                            <Button
                              variant='outline'
                              className='cursor-pointer'
                              size='icon'
                              onClick={() => router.push(`/ai-cover-letter/${letter._id}`)}
                            >
                            <Eye className='h-4 w-4' />
                            </Button>
                          <AlertDialogTrigger asChild>
                            <Button 
                              className='cursor-pointer bg-red-700 hover:bg-red-800 text-white'
                              size='icon'>
                                <Trash2 className='h-4 w-4' />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Cover Letter?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your cover letter
                                for {letter.jobTitle} at {" "} {letter.companyName}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(letter._id)}
                                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-muted-foreground text-sm line-clamp-3'>
                    {letter.jobDescription}
                </div>
              </CardContent>
            </Card>
        ))}
    </div>
  )
}

export default CoverLetterList;