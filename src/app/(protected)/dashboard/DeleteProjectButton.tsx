import { Button } from '@/components/ui/button'
import useProject from '@/hooks/use-project'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import React from 'react'

const DeleteProjectButton = () => {
    const {selectedProjectId , setSelectedProjectId} = useProject()
    const projectId = selectedProjectId ?? ""
    const deleteProject = api.project.deteteProject.useMutation()
    const refetch = useRefetch()
  return (
    <Button
    disabled={deleteProject.isPending}
    onClick={() => {
        if(projectId){
             deleteProject.mutate({projectId}
                ,
                {
                    onSuccess : () => {
                        setSelectedProjectId?.("")
                        refetch()
                    }
                }
            )
        }
    }}
     size={"sm"} variant={"destructive"}>
        Delete Project
    </Button>
  )
}

export default DeleteProjectButton