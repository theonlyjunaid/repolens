import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generateEmbedding, summariseCode } from "./gemini";
import { db } from "@/server/db";
export const loadGithubRepo = async (githubUrl: string , githubToken?: string) => {

    const loader = new GithubRepoLoader(
      githubUrl,
      {
        accessToken: githubToken || "",
        branch: "main",
        recursive: true,
        unknown: "warn",
        ignoreFiles : ['package-lock.json', 'yarn.lock', 'node_modules', 'pnpm-lock.yaml', 'bun.lockb'],
        maxConcurrency : 5,

      }
    );
    const docs = await loader.load();
    return docs;
  };

  export const indexGithubRepo = async ( projectId : string,githubUrl: string , githubToken?: string) => {
    const docs = await loadGithubRepo(githubUrl, githubToken);
    const allEmbeddings = await generateEmbeddings(docs);
    await Promise.allSettled(allEmbeddings.map(async (embedding, index) => {
      console.log(`processing ${index} of ${allEmbeddings.length}`)
      if(!embedding) return;

      const sourceCodeEmbeddding = await db.sourceCodeEmbedding.create({
        data : {
          projectId,
          sourceCode : embedding.sourceCode,
          summary : embedding.summary,
          fileName : embedding.fileName
        }
      })

      await db.$executeRaw`
      UPDATE "SourceCodeEmbedding"
      SET "summaryEmbedding" = ${embedding.embeddings}::vector
      WHERE "id" = ${sourceCodeEmbeddding.id}
      `

    }))
  }

  const generateEmbeddings = async (docs: Document[]) => {
    return await Promise.all(docs.map(async (doc) => {
      const summary = await summariseCode(doc);
      const embeddings = await generateEmbedding(summary);
      return {
        summary,
        embeddings,
        sourceCode : JSON.parse(JSON.stringify(doc.pageContent)),
        fileName : doc.metadata.source
      }
    }))
  }

