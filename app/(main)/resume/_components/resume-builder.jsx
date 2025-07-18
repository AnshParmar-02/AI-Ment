"use client"

import { saveResume } from '@/actions/resume';
import { resumeSchema } from '@/app/lib/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/use-fetch';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Download, Edit, Loader2, Monitor, Save, Scale } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import EntryForm from './entry-form';
import { entriesToMarkdown } from '@/app/lib/helper';
import MDEditor from '@uiw/react-md-editor';
import { useUser } from '@clerk/nextjs';
import { boolean } from 'zod';
import { toast } from 'sonner';

const ResumeBuilder = ({ initialContent }) => {

    const [activeTab, setActiveTab] = useState("edit");
    const [resumeMode, setResumeMode] = useState("preview");
    const [previewContent, setPreviewContent] = useState(initialContent);
    const { user } = useUser();

    const [isGenerating, setIsGenerating] = useState(false);
    const resumeRef = useRef(null);

    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(resumeSchema),
            defaultValues: {
            contactInfo: {},
            summary: "",
            skills: "",
            experience: [],
            education: [],
            projects: [],
        },
    });

    const {
        loading: isSaving,
        fn: saveResumeFn,
        data: saveResult,
        errors: saveError,
    } = useFetch(saveResume);

    const formValues = watch();

    useEffect(() => {
        if(initialContent) {
            setActiveTab("preview");
        }
    }, [initialContent]);

    useEffect(() => {
        if(activeTab === "edit"){
            const newContent = getCombinedMarkdownContent();
            setPreviewContent(newContent ? newContent : initialContent);
        }
    }, [formValues, activeTab]);

    // useEffect(() => {
    //   if (initialContent && !previewContent) {
    //     setPreviewContent(initialContent);
    //   }
    // }, [initialContent, previewContent]);

    const getContactMarkdown = () => {
        const { contactInfo } = formValues;
        const parts = [];

        if(contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
        if(contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
        if(contactInfo.linkedin) parts.push(`💼 [LinkedIn] ${contactInfo.linkedin}`);
        if(contactInfo.twitter) parts.push(`🐦 [Twitter/X] ${contactInfo.twitter}`);

        return parts.length > 0
            ? `## <div align="center">${user.fullName}</div>
               \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
               : "";
    }

    const getCombinedMarkdownContent = () => {
        const { summary, skills, experience, education, projects } = formValues;

        return [
            getContactMarkdown(),
            summary && `## Professional Summary\n\n${summary}`,
            skills && `## Skills\n\n${skills}`,
            entriesToMarkdown(experience, "Work Experience"),
            entriesToMarkdown(education, "Education"),
            entriesToMarkdown(projects, "Projects"),
        ]
        .filter(boolean)
        .join("\n\n");
    }

    useEffect(() => {
        if(saveResult && !isSaving) {
            toast.success("Resumed save successfully!")
        }
        if(saveError) {
            toast.error(saveError.message || "Failed to save resume")
        }
    }, [saveResult, saveError, isSaving])

    const generatePDF = async () => {
        setIsGenerating(true);
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            await new Promise((resolve) => setTimeout(resolve, 500));
            const element = resumeRef.current;
            
            if (!element) {
              console.error("Element with ID 'resume-pdf' not found");
              return;
            }
      
            const opt = {
                margin: [15, 15],
                filename: "resume.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            };

            await html2pdf().set(opt).from(element).save();

        } catch (error) {
            console.error("PDF generate error: ", error);
        } finally {
            setIsGenerating(false);
        }
    }

    const onSubmit = async (data) => {
        try {
            const formattedContent = previewContent
             .replace(/\n/g, "\n")
             .replace(/\n\s*\n/g, "\n\n")
             .trim();

            await saveResumeFn(previewContent)
        } catch (error) {
            console.error("Save error: ", error);
        }
    }

  return (
    <div className='space-y-2'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-2'>
            <h1 className='font-bold gradient-title text-5xl md:text-6xl'>
                Resume Builder
            </h1>

            <div className='space-x-2'>
                <Button 
                  className='cursor-pointer bg-emerald-800 hover:bg-emerald-900 text-white' 
                  onClick={handleSubmit(onSubmit)} 
                  disabled={isSaving} 
                >
                    {isSaving ? (
                        <>
                            <Loader2 className='h-4 w-4 animate-spin' />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className='h-4 w-4' />
                            Save
                        </>
                    )}
                    
                </Button>
                <Button 
                  className='cursor-pointer bg-indigo-800 hover:bg-indigo-900 text-white' 
                  onClick={generatePDF} 
                  disabled={isGenerating} >
                    {isGenerating ? (
                        <>
                            <Loader2 className='h-4 w-4 animate-spin' />
                            Generating pdf...
                        </>
                    ) : (
                        <>
                            <Download className='h-4 w-4' />
                            Download PDF
                        </>
                    )}
                </Button>

            </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger className='bg-background' value="edit">Form</TabsTrigger>
              <TabsTrigger className='bg-background' value="preview">Markdown</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
                <form className='space-y-8'>
                    <div className='space-y-4'>
                        <h3 className='text-lg font-medium'>Contact Information</h3>
                        <div className='grid grid-col-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50'>
                            <div className='space-y-2'>
                                <Label className='text-sm font-medium'>Email</Label>
                                <Input
                                {...register("contactInfo.email")}
                                type='email'
                                placeholder='abc@email.com'
                                error={errors.contactInfo?.email}
                                />

                                {errors.contactInfo?.email && (
                                    <p className='text-sm text-red-500'>
                                        {errors.contactInfo.email.message}
                                    </p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label className='text-sm font-medium'>Mobile Number</Label>
                                <Input
                                {...register("contactInfo.mobile")}
                                type='tel'
                                placeholder='+91 11111 22222'
                                />

                                {errors.contactInfo?.mobile && (
                                    <p className='text-sm text-red-500'>
                                        {errors.contactInfo.mobile.message}
                                    </p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label className='text-sm font-medium'>LinkedIn URL</Label>
                                <Input
                                {...register("contactInfo.linkedin")}
                                type='url'
                                placeholder='https://linkedin.com/your-profile'
                                />

                                {errors.contactInfo?.linkedin && (
                                    <p className='text-sm text-red-500'>
                                        {errors.contactInfo.linkedin.message}
                                    </p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label className='text-sm font-medium'>Twitter/X Profile</Label>
                                <Input
                                {...register("contactInfo.twitter")}
                                type='url'
                                placeholder='https://twitter.com/your-handle'
                                />

                                {errors.contactInfo?.twitter && (
                                    <p className='text-sm text-red-500'>
                                        {errors.contactInfo.twitter.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <h3 className='text-lg font-medium'>Professional Summary</h3>
                        <Controller 
                          name='summary'
                          control={control}
                          render={({ field }) => (
                            <Textarea
                                {...field}
                                className='h-32'
                                placeholder='Write a completing professional summary...'
                                error={errors.summary}
                            />
                            )}
                        />

                        {errors.summary && (
                            <p className='text-sm text-red-500'>
                                {errors.summary.message}
                            </p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <h3 className='text-lg font-medium'>Skills</h3>
                        <Controller 
                        name='skills'
                        control={control}
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                className='h-32'
                                placeholder='List out your skills...'
                                error={errors.summary}
                            />
                            )}
                        />

                        {errors.skills && (
                            <p className='text-sm text-red-500'>
                                {errors.skills.message}
                            </p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <h3 className='text-lg font-medium'>Work Experience</h3>
                        <Controller 
                        name='experience'
                        control={control}
                        render={({ field }) => (
                            <EntryForm 
                               type='Experience'
                               entries={field.value}
                               onChange={field.onChange}
                            />
                            )}
                        />

                        {errors.experience && (
                            <p className='text-sm text-red-500'>
                                {errors.experience.message}
                            </p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <h3 className='text-lg font-medium'>Education</h3>
                        <Controller 
                          name='education'
                          control={control}
                          render={({ field }) => (
                            <EntryForm 
                               type='Education'
                               entries={field.value}
                               onChange={field.onChange}
                            />
                            )}
                        />

                        {errors.education && (
                            <p className='text-sm text-red-500'>
                                {errors.education.message}
                            </p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <h3 className='text-lg font-medium'>Projects</h3>
                        <Controller 
                          name='projects'
                          control={control}
                          render={({ field }) => (
                            <EntryForm 
                               type='Project'
                               entries={field.value}
                               onChange={field.onChange}
                            />
                            )}
                        />

                        {errors.projects && (
                            <p className='text-sm text-red-500'>
                                {errors.projects.message}
                            </p>
                        )}
                    </div>
                </form>
            </TabsContent>
            <TabsContent value="preview">
                <Button 
                  variant='link' 
                  type='button' 
                  className='mb-2 cursor-pointer'
                  onClick={() => 
                    setResumeMode(resumeMode === "preview" ? "edit" : "preview")
                  }
                  >
                    {resumeMode === "preview" ? (
                        <>
                            <Edit className='h-4 w-4' />
                            Edit Resume
                        </>
                    ) : (
                        <>
                            <Monitor className='h-4 w-4' />
                            Show Preview
                        </>
                    )}
                </Button>

                {resumeMode !== "preview" && (
                    <div className='flex p-3 gap-2 items-center border-2 border-red-500 text-red-500 rounded mb-2'>
                        <AlertTriangle className='h-5 w-5' />
                        <span className='text-sm'>
                            You will lose edited markdown if you update the form data.
                        </span>
                    </div>
                )}

                <div className='border rounded-lg'>
                    <MDEditor 
                       value={previewContent} 
                       onChange={setPreviewContent}
                       height={800}
                       preview={resumeMode}
                    />
                </div>

                

                <div className='hidden'>
                <div
                  ref={resumeRef}
                >
                  <MDEditor.Markdown
                    source={previewContent}
                    style={{
                        background: "white",
                        color: "black",
                    }}
                  />
                </div>
                </div>

                {/* <div className='hidden'>
                  <div
                    ref={resumeRef}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      padding: '20px',
                      width: '100%',
                      maxWidth: '210mm',
                      margin: '0 auto'
                    }}
                  >
                    <div style={{
                      backgroundColor: '#ffffff',
                      color: '#000000'
                    }}>
                      <MDEditor.Markdown
                        source={previewContent}
                        style={{
                          background: '#ffffff',
                          color: '#000000',
                          fontFamily: 'Arial, Helvetica, sans-serif'
                        }}
                      />
                    </div>
                  </div>
                </div> */}
            </TabsContent>
        </Tabs>
    </div>
  )
}

export default ResumeBuilder;