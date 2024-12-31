"use client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import useProject from '@/hooks/use-project';
import { api } from '@/trpc/react';
import React, { useEffect, useState } from 'react';
import AskQuestionCard from '../dashboard/ask-question-card';
import MDEditor from '@uiw/react-md-editor';
import CodeReferences from '../dashboard/code-references';

const QAPage = () => {
  const { selectedProjectId } = useProject();
  const projectId = selectedProjectId ?? "";
  const [questionIndex, setQuestionIndex] = useState<number | null>(null);
  const [question, setQuestion] = useState<Record<string, any> | null>(null);

  // Fetch questions using the projectId
  const { data: questions } = api.project.getQuestions.useQuery(
    { projectId },
    { enabled: Boolean(projectId) } // Only fetch if projectId exists
  );

  // Ensure `setQuestion` runs consistently
  useEffect(() => {
    if (questions && questionIndex !== null && questionIndex >= 0 && questionIndex < questions.length) {
      setQuestion(questions[questionIndex] ?? null);
    } else {
      setQuestion(null); // Reset if index is invalid
    }
  }, [questions, questionIndex]);

  // Early return for clean rendering
  if (!projectId) return null;

  return (
    <Sheet>
      <AskQuestionCard />
      <div className="h-4"></div>
      <h1 className="text-xl font-semibold">Saved Questions</h1>
      <div className="h-2"></div>
      <div className="flex flex-col gap-2">
        {questions?.map((q, index) => (
          <React.Fragment key={q.id}>
            <SheetTrigger onClick={() => setQuestionIndex(index)}>
              <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow border">
                <img
                  className="rounded-full"
                  height={30}
                  width={30}
                  src={q.user?.imageUrl ?? ""}
                  alt="user"
                />
                <div className="text-left flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700 line-clamp-1 text-lg font-medium">
                      {q.question}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-500 line-clamp-2 text-sm">{q.answer}</p>
                </div>
              </div>
            </SheetTrigger>
          </React.Fragment>
        ))}
      </div>

      {question && (
        <SheetContent className="sm:max-w-[80vw]">
          <SheetHeader>
            <SheetTitle>{question.question}</SheetTitle>
          </SheetHeader>
          <MDEditor.Markdown className='p-4 rounded-md' source={question.answer} />
          <CodeReferences filesRefrences={(question.fileReferences ?? []) as any} />
        </SheetContent>
      )}
    </Sheet>
  );
};

export default QAPage;
