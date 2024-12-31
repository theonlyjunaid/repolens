import { db } from '@/server/db';
import {Octokit} from 'octokit';
import axios from 'axios';
import { aiSummariseCommit } from './gemini';
export const octokit =  new Octokit({
    auth: process.env.GITHUB_TOKEN,
   
})

interface CommitInfo {
    commitHash: string;
    commitMessage: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    commitDate: string;
}

export const getCommitHashes = async (githubUrl : string) : Promise<CommitInfo[]> => {
   const owner = githubUrl.split('/')[3];
    const repo = githubUrl.split('/')[4];
    if(!owner || !repo) {
         throw new Error("Invalid github url")
    }
    const {data} = await octokit.rest.repos.listCommits({
         owner: githubUrl.split('/')[3] ?? '', 
         repo: githubUrl.split('/')[4] ?? ''
   })

   const sortedCommits = data?.sort((a: any , b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime())
   
   return sortedCommits.slice(0,10).map((commit : any) => ({
        commitHash : commit?.sha as string,
        commitMessage : commit?.commit?.message ?? "",
        commitAuthorName : commit?.commit?.author?.name ?? "",
        commitAuthorAvatar : commit?.author?.avatar_url ?? "",
        commitDate : commit?.commit?.author?.date ?? "",   
   }) )

}


export const pollCommits = async (projectId : string) => { 
    const {project, githubUrl} = await fetchProjectGithubUrl(projectId);
    const commitHashes = await getCommitHashes(githubUrl);
    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);
    const summariesResponse = await Promise.allSettled(unprocessedCommits.map(commit => summariseCommit(githubUrl, commit.commitHash)))
    const summaries = summariesResponse.map((summary) => {
        if(summary.status === 'fulfilled') {
            return summary.value as string;
        }
        return "";
    })

    const commit = await db.commit.createMany({
        data: summaries.map((summary, index) => {
            console.log(`processing commit ${index}`)
            return {
                projectId,
                commitHash: unprocessedCommits[index]!.commitHash,
                commitMessage: unprocessedCommits[index]!.commitMessage,
                commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
                commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
                commitDate: unprocessedCommits[index]!.commitDate,
                summary
            }
        })
    })
    return commit;
 }

async function fetchProjectGithubUrl(projectId : string) {
    const project = await db.project.findUnique({
        where: {
            id: projectId
        },
        select: {
            githubUrl: true
        }
    })
    if(!project?.githubUrl) {
        throw new Error("Project has no github url");
    }
    return {
        project,
        githubUrl: project.githubUrl
    }
}

async function filterUnprocessedCommits(projectId : string, commitHashes : CommitInfo[]) {
    const processedCommits = await db.commit.findMany({
        where: {
            projectId
        }
    })
    const unprocessedCommits = commitHashes.filter(commit => !processedCommits.some(processedCommit => processedCommit.commitHash === commit.commitHash))
    return unprocessedCommits;
}


async function summariseCommit(githubUrl : string, commitHash : string){
    const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff`,{
        headers: {
            Accept: 'application/vnd.github.v3.diff'
        }
    })
    return await aiSummariseCommit(data) || "";
}

