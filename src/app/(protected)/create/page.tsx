"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useRefetch from '@/hooks/use-refetch'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/trpc/react'
import { FormInput } from 'lucide-react'
import React from 'react'
import {useForm} from 'react-hook-form'


type FormInput ={
    repoUrl : string,
    projectName : string,
    githubToken? : string
}


const CreatePage = () => {

    const {register, handleSubmit, reset } = useForm<FormInput>()

    const createProject = api.project.createProject.useMutation()

    
    
    const { toast } = useToast()
    const refetch = useRefetch()

    function onSubmit(data: FormInput){
        createProject.mutate({
            githubUrl : data.repoUrl,
            name : data.projectName,
        },{
            onSuccess : () => {
                toast({
                    description : "Project Created Successfully"
                })
                refetch()
                reset()
            },
            onError : () => {
                toast({
                    variant: "destructive",
                    description: "Failed to create the Project"
                })
            }
        })
        return true
    }
  return (
    <div className='flex items-center gap-12 h-full justify-center'>
        <img src='/create.png' className='h-56 w-auto' />
        <div>
            <div>
                <h1 className='font-semibold text2xl '>Link your Github Repository</h1>
                <p className='text-sm text-muted-foreground'>
                    Enter the URL of your repository to link it to Repolens.
                </p>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='h-2'></div>
                    <Input
                        {...register('projectName',  {required : true})}
                        placeholder='Project Name'
                        required
                     /> 
                     <div className='h-2'></div>
                    <Input
                        {...register('repoUrl',  {required : true})}
                        placeholder='Girhub Url'
                        type='url'
                        required
                     /> 
                     <div className='h-2'></div>
                     

                     <div className='h-4'></div>
                     <Button disabled={createProject.isPending} type='submit'>
                        Create Project
                     </Button>

                </form>
            </div>
        </div>
    </div>
  )
}

export default CreatePage