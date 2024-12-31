import { api } from '@/trpc/react'
import {useLocalStorage} from 'usehooks-ts'




const useProject = () => {
    const { data : projects , isLoading , isError, error} = api?.project?.getProjects?.useQuery()
    const [selectedProjectId, setSelectedProjectId] = useLocalStorage('selectedProject', "")
    if (isLoading) {
        console.log("Loading projects...");
        return { projects: [], project: null, isLoading };
      }

      if (isError) {
        console.error("Error fetching projects:", error);
        return { projects: [], project: null, isError, error };
      }

    
    const project = projects?.find((project) => project.id === selectedProjectId)
    return {
        projects,
        setSelectedProjectId,
        selectedProjectId,
        project,
        isLoading, 
        isError

    }
}

export default useProject