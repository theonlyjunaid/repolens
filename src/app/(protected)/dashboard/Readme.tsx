"use client"
import useProject from '@/hooks/use-project'
import React from 'react'
import { generateReadme } from './readmeAction'
import { readStreamableValue } from 'ai/rsc'
import { Button } from '@/components/ui/button'
import MDEditor from '@uiw/react-md-editor'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'
import CodeReferences from './code-references'
import ReactMarkdown from 'react-markdown'
import { Copy } from 'lucide-react'

const Readme = () => {
    const {selectedProjectId} = useProject()
    const projectId = selectedProjectId || ''
    const [readme, setReadme] = React.useState('')
    const [open, setOpen] = React.useState(false)
    const [fileRefrences, setFileRefrences] = React.useState<{
        fileName: string,
        sourceCode: string,
        summary: string
    }[]>([])

    const generateReadmee = async () => {
        setReadme('')
        const { output, fileReferences } = await generateReadme(projectId)
        setFileRefrences(fileReferences)
        setOpen(true)
        for await (const delta of readStreamableValue(output)){
            if(delta){
                setReadme(prev => prev + delta)
            }
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(readme).then(() => {
            alert("Copied to clipboard!")
        }).catch(err => console.error("Failed to copy: ", err))
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='sm:max-w-[90vw] max-h-[90vh] overflow-scroll'>
                    <DialogHeader>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <DialogTitle>
                                    <Image src='/logo.webp' alt='logo' width={40} height={40}/>
                                </DialogTitle>
                            </div>
                            <Button onClick={copyToClipboard} className='flex mt-4 items-center gap-1'>
                                <Copy size={16} /> Copy
                            </Button>
                        </div>
                    </DialogHeader>
                    <MDEditor.Markdown source={readme} className='w-full p-4 rounded-md !h-full max-h-[80vh] overflow-scroll' />
                    <Button type='button' onClick={() => setOpen(false)}>Close</Button>
                </DialogContent>
            </Dialog>
            <Button onClick={generateReadmee}>Generate Readme</Button>
        </div>
    )
}

export default Readme
