import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { pollCommits } from "@/lib/github";
import { indexGithubRepo } from "@/lib/github-loader";

export const projectRouter = createTRPCRouter({

    createProject : protectedProcedure.input(
        z.object({
            name: z.string(),
            githubUrl: z.string(),
        })
    ).mutation(async ({ctx,input}) => {

        const githubTOken = process.env.GITHUB_TOKEN;
        const project = await ctx.db.project.create({
            data : {
                githubUrl : input.githubUrl,
                name : input.name,
                userToProjects : {
                    create : {
                        userId : ctx.user.id!
                    }
                }
            }
        })
        await indexGithubRepo(project?.id, input?.githubUrl, githubTOken)
        await pollCommits(project.id!)
        return project
    } ),

    getProjects : protectedProcedure.query(async({ctx}) => {

        const projects =  await ctx.db.project.findMany({
            where:{
                userToProjects : {
                    some : {
                        userId : ctx.user.id!
                    }
                },
                deletedAt : null
            }
        })
        return projects

    }),

    getCommits: protectedProcedure.input(z.object({
        projectId : z.string()
    })).query(async ({ctx,input}) => {
        pollCommits(input.projectId).then().catch(console.error)
        return await ctx.db.commit.findMany({
            where : { projectId : input.projectId}
        })


    }),

    saveAnswer : protectedProcedure.input(z.object({
        projectId : z.string(),
        question : z.string(),
        fileReferences : z.any(),
        answer : z.string()
    })).mutation(async ({ctx,input}) => {
        return await ctx.db.question.create({
            data : {
                projectId : input.projectId,
                question : input.question,
                answer : input.answer,
                fileReferences : input.fileReferences,
                userId : ctx.user.id!
            }
        })
    }),
    getQuestions : protectedProcedure.input(z.object({
        projectId : z.string()
    })
).query( async ({ctx, input}) => {
    return await ctx.db.question.findMany({
        where : { projectId : input.projectId},
        orderBy : { createdAt : "desc"},
        include : {user : true}
    })
    

        

}),
deteteProject : protectedProcedure.input(z.object({projectId : z.string()})).mutation(async ({ctx,input}) => {
    await ctx.db.userToProject.deleteMany({
        where : {projectId : input.projectId}
    })
    await ctx.db.question.deleteMany({
        where : {projectId : input.projectId}
    })
    await ctx.db.commit.deleteMany({
        where : {projectId : input.projectId}
    })
    await ctx.db.sourceCodeEmbedding.deleteMany({
        where : {projectId : input.projectId}
    })
    await ctx.db.project.delete({
        where : {id : input.projectId},
    })


})

})