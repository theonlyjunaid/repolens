"use client";

import useProject from '@/hooks/use-project';
import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import CommitLog from './commit-log';
import AskQuestionCard from './ask-question-card';
import DeleteProjectButton from './DeleteProjectButton';
import Readme from './Readme';

const DashboardPage = () => {
  const { project, isLoading, isError, error } = useProject();

  if (isLoading) return <div>Loading project details...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (!project) return <div>No project selected.</div>;

  return (
    <div>
      <div className='flex items-center justify-between flex-wrap gap-y-4'>
        {/* Github Link  */}
        <div className='w-fit rounded-md bg-primary px-4 py-3'>
          <div className='flex items-center'>
            <Github className='size-5 text-whitw'/>
            <div className='ml-2'>
              <p className='text-sm font-medium text-white'>
                The project is linked to {' '}
                <Link href={project?.githubUrl ?? ''} className='inline-flex items-center text-white/80 hover:underline'>
                {project?.githubUrl}
                <ExternalLink className='ml-1 size-4'/>
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="h4"></div>
        <div className='flex items-center gap-4'>
         <DeleteProjectButton />
        </div>


      </div>
     
      <div className="mt-4">
        <div className='grid overflow-scroll grid-cols-1 gap-4 sm:grid-cols-5'>
          <AskQuestionCard/>
          <Readme/>
        </div>
      </div>
      <div className="mt-8">
        <CommitLog/>
      </div>
    </div>
  );
};

export default DashboardPage;
