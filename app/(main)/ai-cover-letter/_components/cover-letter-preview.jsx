"use client";

import React from 'react';
import MDEditor from '@uiw/react-md-editor';

const CoverLetterPreview = ({ content }) => {
    
  return (
    <div>
        <div className='py-4'>
            <MDEditor
               value={content}
               preview='preview'
               height={700}
            />
        </div>
    </div>
  )
}

export default CoverLetterPreview;