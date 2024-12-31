"use client"

import { cn } from "@/lib/utils"
import { Tabs, TabsContent } from "@radix-ui/react-tabs"
import React from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { lucario } from "react-syntax-highlighter/dist/esm/styles/prism"

type Props = {
    filesRefrences : {
        fileName : string,
        sourceCode : string,
        summary : string
    }[]
}

const CodeReferences = ({filesRefrences} : Props) => {
    const [tab, setTab] = React.useState(filesRefrences[0]?.fileName)
    if(filesRefrences.length === 0) return null



    return (
        <div className="max-w-[70vw]">
            <Tabs value={tab} onValueChange={setTab}>
                <div className="overflow-scroll flex gap-2 bg-gray-200 p-1 rounded-md">
                    {filesRefrences.map((file) => (
                        <button onClick={() => setTab(file.fileName)} className={cn(
                            "px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                            {
                                "bg-primary text-primary-foreground" : tab === file.fileName,
                            }
                        )} key={file.fileName}>
                            {file.fileName}
                        </button>
                    ))}
                </div>
                {filesRefrences.map((file) => (
                    <TabsContent value={file.fileName} key={file.fileName} className="max-h-[40vh] overflow-scroll max-w-7xl rounded-md">
                        <SyntaxHighlighter language="typescript" style={lucario} showLineNumbers>
                            {file.sourceCode}
                        </SyntaxHighlighter>
                    </TabsContent>
                ))}
            </Tabs>
           
        </div>
    )
}

export default CodeReferences;