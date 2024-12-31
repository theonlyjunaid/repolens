import {GoogleGenerativeAI} from "@google/generative-ai"
import {Document} from "@langchain/core/documents"
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
    model : 'gemini-1.5-flash'
})


export const aiSummariseCommit = async (diff : string) => {
    const response = await model.generateContent([
        `You are an expert programmer, and you are trying to summarize a git diff.
Reminders about the git diff format:
For every file, there are a few metadata lines, like (for example):
\`\`\`
diff --git a/lib/index.js b/lib/index.js
index aadf691..bfef603 100644
--- a/lib/index.js
+++ b/lib/index.js
\`\`\`
This means that \'lib/index.js\' was modified in this commit. Note that this is only an example.
Then there is a specifier of the lines that were modified.
A line starting with\'+\' means it was added.
A line that starting with \'-\' means that line was deleted.
A line that starts with neither \'+\' nor \'-\' is code given for context and better understanding.
It is not part of the diff.
[...]
EXAMPLE SUMMARY COMMENTS:
\`\`\`
* Raised the amount of returned recordings from \'10\' to \'1081\' [packages/server/recordings_api.ts], [packages/server/constants.ts]
* Fixed a typo in the github action name .github/workflows/gpt-commit-summarizer.yml]
* Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
* Added an OpenAI API for completions [packages/utils/apis/openai.ts]
* Lowered numerix tolerance for the tests [packages/server/tests/numerix.test.ts]
\`\`\`
Most commits will have less comments than this examples list.
The last comment does not include the file names,
because there were more than two relevant files in the hypothetical commit
Do not include parts of the example in your summary.
It is given only as an example of appropriate comments.`,
    
        `Please summarise the following diff file: 
        \`\`\`
        ${diff}
        \`\`\`
        `,

        ]);

        return response.response.text();
    }


export const summariseCode = async (doc : Document) => {
   try {
    console.log("getting summary for", doc.metadata.source)
    const code = doc.pageContent.slice(0, 10000) // limit to 10k characters
    const response = await model.generateContent([
        `You are an intelligent senior software engineer who spelises in onboarding junior software engineers onto projects`,
        `You are onboarding a junior software engineer and explaining to them the purpose of: ${doc.metadata.source} file
        Here is the code:
        ---
        ${code}
        ---
            Give a summary not more than 100 words of the code above
        `,
    ])

    return response.response.text();
   } catch (error) {
    return ""
   }
}
export const rephraseQuestion = async (question : string) => {
   try {
    const response = await model.generateContent([
        `You are an intelligent senior software engineer who spelises in onboarding junior software engineers onto projects`,
        `You are onboarding a junior software engineer and he/she ask you this question:
        Here is the question:
        ---
        ${question}
        ---
            Rephare the question so that the vector representation of the question can be used to find the most relevant file from the code base that can answer the question 

            include keywoeds that are relevant to the code base
            

            ONLY RETURN THE REPHRASED QUESTION
        `,
    ])

    return response.response.text();
   } catch (error) {
    return ""
   }
}

export const generateEmbedding = async (summary: string) => {

    const model = genAI.getGenerativeModel({
        model : 'text-embedding-004'
    })
    const result = await model.embedContent(summary)
    const embeddings = result.embedding
    return embeddings.values;
}
