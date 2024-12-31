"use server"
 import {streamText } from "ai"
 import { createStreamableValue} from "ai/rsc"
 import {createGoogleGenerativeAI} from "@ai-sdk/google"
import { db } from "@/server/db"
import { generateEmbedding, rephraseQuestion } from "@/lib/gemini"

 const google = createGoogleGenerativeAI({
        apiKey : process.env.GEMINI_API_KEY!
 })

 export const askQuestion = async (question:string, projectId : string) => {
    const stream = createStreamableValue()
    const rephrasedQuestion = await rephraseQuestion( question)
    console.log("rephrased question" ,rephrasedQuestion)
    const queryVector = await generateEmbedding(rephrasedQuestion)
    const vectorQuery = `[${queryVector.join(",")}]`

    const result = await db.$queryRaw`
    SELECT "fileName", "sourceCode", "summary",
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > .3
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 10
    ` as {fileName : string, sourceCode : string, summary : string}[]

    let context = "";

    for (const doc of result){
        context += `Source: ${doc.fileName} \n code content: ${doc.sourceCode} \n Summary of file: ${doc.summary} \n\n`
    }

    (async () => {
        const {textStream} = await streamText({
            model : google("gemini-1.5-flash"),
            prompt: `
                You are a AI code assistant who answers questions about the codebase. Your target audience is a technical intern.

                AI assistant is a brand new, powerful, human-like artificial intelligence.

                The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.

                AI is a well-behaved and well-mannered individual.

                AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.

                AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic. If the question is asking about code or a specific file, AI will provide the detailed answer, giving step-by-step instructions.

                START CONTEXT BLOCK
                ${context}
                END OF CONTEXT BLOCK

                START QUESTION
                ${question}
                END OF QUESTION

                AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation. If the context does not provide the answer to the question, the AI assistant will say, "I'm sorry, but I don't know the answer."

                AI assistant will not apologize for previous responses, but instead will indicate new information was gained.

                AI assistant can also add any other relevant information in the context block if needed to answer the question

                AI assistant can also fill in the gap in the context block if needed to answer the question

                AI assistant will provide answer in structured format 
                Answer in markdown syntax, with code snippets if needed. Be as detailed as possible when answering, make sure there is no ambiguity.
  `
        })

    for await (const delta of textStream){
        stream?.update(delta)
    }

    stream.done()

    })()

    return {
        output : stream.value,
        fileRefrences : result
    }

   
 } 