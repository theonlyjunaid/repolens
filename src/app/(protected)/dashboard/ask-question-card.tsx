"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import useProject from '@/hooks/use-project'
import Image from 'next/image'
import React from 'react'
import { askQuestion } from './actions'
import { readStreamableValue } from 'ai/rsc'
import MDEditor from '@uiw/react-md-editor'
import CodeReferences from './code-references'
import { api } from '@/trpc/react'
import { toast } from '@/hooks/use-toast'
import useRefetch from '@/hooks/use-refetch'


const AskQuestionCard = () => {
    const { project } = useProject()
    const [question, setQuestion] = React.useState('')
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [fileRefrences, setFileRefrences] = React.useState<{
        fileName: string,
        sourceCode: string,
        summary: string
    }[]>([])
    const refetch = useRefetch()
    const [answer, setAnswer] = React.useState('')
    const saveAnswer = api.project.saveAnswer.useMutation()

    
    const handleSubmit = async (e: React.FormEvent) => {
        setAnswer('')
        setFileRefrences([])
        if(!project?.id) return
        e.preventDefault()
        setLoading(true)

        const {output, fileRefrences} = await askQuestion(question, project.id)
        setOpen(true)

        setFileRefrences(fileRefrences)

        for await (const delta of readStreamableValue(output)){
            if(delta){
                setAnswer(prev => prev + delta)
            }
        }
        setLoading(false)
    }   

  return (
    <>
        <Dialog  open={open} onOpenChange={setOpen}>
            <DialogContent className='sm:max-w-[80vw]' >
            <DialogHeader>
                <div className='flex items-center gap-2'>
                    <DialogTitle>
                        <Image src='/logo.webp' alt='logo' width={40} height={40}/>
                    </DialogTitle>
                    <Button disabled={saveAnswer.isPending} variant={"outline"} onClick={()=>{
                        saveAnswer.mutate({
                            projectId : project?.id!,
                            question,
                            fileReferences : fileRefrences,
                            answer
                        },
                        {
                            onSuccess : () => {
                                toast({
                                    description : 'Your answer has been saved',
                                    variant : 'default'
                                })
                                refetch()
                            },
                            onError : (error) => {
                                toast({
                                    description :"Failed to save the answer",
                                    variant : 'destructive'
                                })
                            }
                        }
                    )
                    }}>
                        Save Answer
                    </Button>

                </div>
            </DialogHeader>
            
            <MDEditor.Markdown  source={answer}  className='max-w-[80vw] p-4 rounded-md  !h-full max-h-[50vh] overflow-scroll' />
            <Button type='button' onClick={() => setOpen(false)}>Close</Button>
            <CodeReferences filesRefrences={fileRefrences} />
            

            </DialogContent>
        </Dialog>
        <Card className='relative col-span-3'>
            <CardHeader>
                <CardTitle>Ask a Question</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <Textarea 
                        placeholder='Which file should I edit to change the home page'
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                    />
                    <div className="h-4"></div>
                    <Button disabled={loading} type='submit' >Ask Repo Lens</Button>
                </form>
            </CardContent>
        </Card>
    </>
  )
}

export default AskQuestionCard