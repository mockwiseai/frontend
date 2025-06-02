// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import dynamic from 'next/dynamic';
// import { ArrowLeft } from 'lucide-react';
// import { Question, Example, TestCase } from "@/types/question";
// import Timer from '@/components/common/Timer';
// import UserMedia from '@/components/practice/UserMedia';
// import { useInterview } from '@/hooks/useInterview';
// import api from '@/services/api';

// const CodeEditor = dynamic(() => import('@/components/compiler/CodeEditor'), {
//     ssr: false,
//     loading: () => (
//         <div className="animate-pulse bg-gray-800 rounded-lg h-[calc(100vh-96px)]" />
//     ),
// });

// export default function PracticePage() {
//     const router = useRouter();
//     const params = useParams();
//     const { interview, submitAnswer, updateCompletedQuestions } = useInterview();
//     const [question, setQuestion] = useState<Question | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const questionId = params.question;
//     const timer = interview?.totalTime || 30;


//     useEffect(() => {
//         const fetchQuestion = async () => {
//             try {
//                 setLoading(true);
//                 const response = await api.get(`/api/recruiter/interviews/question/${questionId}`);
//                 console.log("Response:", response);
                
//                 let question = response.data.data;
//                 console.log("Questions:", question);

//                 setQuestion(question);
//                 setLoading(false);
//             } catch (err) {
//                 setError("Failed to fetch question");
//                 setLoading(false);
//                 console.error("Error fetching question:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };



//         if (interview?._id) {
//             fetchQuestion();
//         }
//     }, [questionId, interview?._id]);

//     console.log("Interview:", interview);
    
//     const handleTimeEnd = () => {
//         console.log("Time ended");
//     };

//     console.log("Question:", question);
    
//     const renderExample = (example: Example, index: number) => (
//         <div key={index} className="mt-6 space-y-2">
//             <h3 className="text-white text-lg">Example {index + 1}:</h3>
//             <div className="bg-gray-900 rounded-lg p-4 space-y-2 overflow-x-auto">
//                 <div>
//                     <span className="text-blue-400 font-semibold">Input: </span>
//                     <pre className="text-white mt-1 whitespace-pre-wrap break-words">
//                         {example.input}
//                     </pre>
//                 </div>
//                 <div>
//                     <span className="text-green-400 font-semibold">Output: </span>
//                     <pre className="text-white mt-1 whitespace-pre-wrap break-words">
//                         {example.output}
//                     </pre>
//                 </div>
//                 {example.explanation && (
//                     <div>
//                         <span className="text-yellow-400 font-semibold">Explanation:</span>
//                         <pre className="text-white mt-1 whitespace-pre-wrap break-words">
//                             {example.explanation}
//                         </pre>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );

//     const renderTestCases = (testCases: TestCase[]) => (
//         <div className="mt-8 space-y-4">
//             <h3 className="text-white text-lg border-t border-gray-700 pt-4">
//                 Test Cases:
//             </h3>
//             {testCases.map((testCase, index) => (
//                 <div
//                     key={index}
//                     className="bg-gray-900 rounded-lg p-4 space-y-2 overflow-x-auto"
//                 >
//                     <div>
//                         <span className="text-blue-400 font-semibold">Input: </span>
//                         <pre className="text-white mt-1 whitespace-pre-wrap break-words">
//                             {testCase.input}
//                         </pre>
//                     </div>
//                     <div>
//                         <span className="text-green-400 font-semibold">Output: </span>
//                         <pre className="text-white mt-1 whitespace-pre-wrap break-words">
//                             {testCase.output}
//                         </pre>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );

//     const renderConstraints = (constraints: string[]) => (
//         <div className="mt-6">
//             <h3 className="text-white text-lg">Constraints:</h3>
//             <ul className="list-disc list-inside text-gray-300 mt-2">
//                 {constraints.map((constraint: string, index: number) => (
//                     <li key={index} className="whitespace-pre-wrap break-words">
//                         {constraint}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
//                 <div className="animate-pulse text-white">Loading3...</div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
//                 <div className="text-red-500">{error}</div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
//             <header className="fixed top-0 left-0 right-0 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 z-10">
//                 <div className="px-4 py-3">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-4">
//                             <button
//                                 onClick={() => router.push('/live/' + params.interviewId + "/session")}
//                                 className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
//                             >
//                                 <ArrowLeft size={20} />
//                                 <span>Back</span>
//                             </button>
//                             <span className="text-gray-400">|</span>
//                             {question?.difficulty && (
//                                 <span className="text-white font-medium capitalize">
//                                     {question.difficulty} Level
//                                 </span>
//                             )}
//                         </div>
//                         <Timer initialMinutes={timer} onTimeEnd={handleTimeEnd} />
//                     </div>
//                 </div>
//             </header>
//             <main className="pt-16 lg:h-[calc(100vh-64px)]">
//                 <div className="grid lg:grid-cols-2 h-full">
//                     <div className="overflow-y-auto border-r border-gray-800 p-6 space-y-6">
//                         <div className='flex justify-center gap-5'>
//                             <UserMedia />
//                             <div className="relative bg-gray-900 rounded-lg border border-gray-800 flex flex-col items-center justify-center gap-4 w-full p-8">
//                                 <img
//                                     src="https://static.vecteezy.com/system/resources/previews/037/920/741/non_2x/ai-generated-smiling-female-manager-interviews-applicant-in-office-for-job-position-hiring-image-for-startups-photo.jpeg"
//                                     alt="AI Interviewer Alexa"
//                                     className="w-24 h-24 rounded-full object-cover border-4 border-gray-700"
//                                 />
//                                 <div className="text-white text-sm font-medium">
//                                     Alexa
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="overflow-y-auto border-r border-gray-800">
//                             {question && (
//                                 <div className="p-6">
//                                     <h1 className="text-2xl font-bold text-white mb-6">
//                                         {question.title}
//                                     </h1>
//                                     <div className="prose prose-invert max-w-none">
//                                         <p className="text-gray-300 whitespace-pre-wrap break-words">
//                                             {question.description}
//                                         </p>
//                                         {question.examples?.map((example, index) =>
//                                             renderExample(example, index)
//                                         )}
//                                         {question.constraints &&
//                                             renderConstraints(question.constraints)}
//                                         {question.testCases &&
//                                             renderTestCases(question.testCases)}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                     <div className="h-full">
//                         <CodeEditor onSubmit={(code) => {
//                             if (question) {
//                                 updateCompletedQuestions(question._id);
//                                 submitAnswer(question._id, code);
//                                 // go back to previous page withouth reloading
//                                 if (typeof window !== 'undefined') {
//                                     window.history.back();
//                                 }
//                             }
//                             console.log("Code submitted");
//                         }} />
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }


"use client"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import dynamic from "next/dynamic"
import { ArrowLeft, Send } from "lucide-react"
import type { Question, Example, TestCase } from "@/types/question"
import Timer from "@/components/common/Timer"
import UserMedia from "@/components/practice/UserMedia"
import { useInterview } from "@/hooks/useInterview"
import api from "@/services/api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const CodeEditor = dynamic(() => import("@/components/compiler/CodeEditor"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-800 rounded-lg h-[calc(100vh-96px)]" />,
})

export default function PracticePage() {
  const router = useRouter()
  const params = useParams()
  const { interview, submitAnswer, updateCompletedQuestions } = useInterview()
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [textAnswer, setTextAnswer] = useState("")
  const questionId = params.question
  const timer = interview?.totalTime || 30

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/api/recruiter/interviews/question/${questionId}`)
        console.log("Response:", response)

        const question = response.data.data
        console.log("Questions:", question)

        setQuestion(question)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch question")
        setLoading(false)
        console.error("Error fetching question:", err)
      } finally {
        setLoading(false)
      }
    }

    if (interview?._id) {
      fetchQuestion()
    }
  }, [questionId, interview?._id])

  console.log("Interview:", interview)

  const handleTimeEnd = () => {
    console.log("Time ended")
  }

  console.log("Question:", question)

  const renderExample = (example: Example, index: number) => (
    <div key={index} className="mt-6 space-y-2">
      <h3 className="text-white text-lg">Example {index + 1}:</h3>
      <div className="bg-gray-900 rounded-lg p-4 space-y-2 overflow-x-auto">
        <div>
          <span className="text-blue-400 font-semibold">Input: </span>
          <pre className="text-white mt-1 whitespace-pre-wrap break-words">{example.input}</pre>
        </div>
        <div>
          <span className="text-green-400 font-semibold">Output: </span>
          <pre className="text-white mt-1 whitespace-pre-wrap break-words">{example.output}</pre>
        </div>
        {example.explanation && (
          <div>
            <span className="text-yellow-400 font-semibold">Explanation:</span>
            <pre className="text-white mt-1 whitespace-pre-wrap break-words">{example.explanation}</pre>
          </div>
        )}
      </div>
    </div>
  )

  const renderTestCases = (testCases: TestCase[]) => (
    <div className="mt-8 space-y-4">
      <h3 className="text-white text-lg border-t border-gray-700 pt-4">Test Cases:</h3>
      {testCases.map((testCase, index) => (
        <div key={index} className="bg-gray-900 rounded-lg p-4 space-y-2 overflow-x-auto">
          <div>
            <span className="text-blue-400 font-semibold">Input: </span>
            <pre className="text-white mt-1 whitespace-pre-wrap break-words">{testCase.input}</pre>
          </div>
          <div>
            <span className="text-green-400 font-semibold">Output: </span>
            <pre className="text-white mt-1 whitespace-pre-wrap break-words">{testCase.output}</pre>
          </div>
        </div>
      ))}
    </div>
  )

  const renderConstraints = (constraints: string[]) => (
    <div className="mt-6">
      <h3 className="text-white text-lg">Constraints:</h3>
      <ul className="list-disc list-inside text-gray-300 mt-2">
        {constraints.map((constraint: string, index: number) => (
          <li key={index} className="whitespace-pre-wrap break-words">
            {constraint}
          </li>
        ))}
      </ul>
    </div>
  )

  const handleSubmitTextAnswer = () => {
    if (question) {
      updateCompletedQuestions(question._id)
      submitAnswer(question._id, textAnswer)
      // go back to previous page without reloading
      if (typeof window !== "undefined") {
        window.history.back()
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  // Common header and user media section
  const renderHeader = () => (
    <header className="fixed top-0 left-0 right-0 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 z-10">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/live/" + params.interviewId + "/session")}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <span className="text-gray-400">|</span>
            {question?.difficulty && (
              <span className="text-white font-medium capitalize">{question.difficulty} Level</span>
            )}
          </div>
          <Timer initialMinutes={timer} onTimeEnd={handleTimeEnd} />
        </div>
      </div>
    </header>
  )

  const renderUserMediaSection = () => (
    <div className="flex justify-center gap-5">
      <UserMedia />
      <div className="relative bg-gray-900 rounded-lg border border-gray-800 flex flex-col items-center justify-center gap-4 w-full p-8">
        <img
          src="https://static.vecteezy.com/system/resources/previews/037/920/741/non_2x/ai-generated-smiling-female-manager-interviews-applicant-in-office-for-job-position-hiring-image-for-startups-photo.jpeg"
          alt="AI Interviewer Alexa"
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-700"
        />
        <div className="text-white text-sm font-medium">Alexa</div>
      </div>
    </div>
  )

  const renderQuestionDescription = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">{question?.title}</h1>
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300 whitespace-pre-wrap break-words">{question?.description}</p>
      </div>
    </div>
  )

  // Render different content based on question type
  const renderQuestionContent = () => {
    if (!question) return null

    switch (question?.questionType) {
      case "SystemDesign":
        return (
          <div className="grid lg:grid-cols-2 h-full">
            <div className="overflow-y-auto border-r border-gray-800 p-6 space-y-6">
              {renderUserMediaSection()}
              <div className="overflow-y-auto">
                {renderQuestionDescription()}
                <div className="p-6 pt-0">
                  <div className="bg-gray-900 rounded-lg p-4 mb-4">
                    <h3 className="text-white text-lg mb-2">System Design Guidelines:</h3>
                    <ul className="list-disc list-inside text-gray-300">
                      <li>Consider scalability and performance requirements</li>
                      <li>Discuss trade-offs between different approaches</li>
                      <li>Address data storage and retrieval strategies</li>
                      <li>Consider security and privacy concerns</li>
                      <li>Explain your architecture with diagrams if possible</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full flex flex-col">
              <div className="flex-1 p-6 overflow-y-auto">
                <Textarea
                  placeholder="Design your solution here. Describe the architecture, components, and interactions..."
                  className="w-full h-full min-h-[calc(100vh-250px)] bg-gray-900 border-gray-700 text-white p-4 resize-none"
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                />
              </div>
              <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
                  onClick={handleSubmitTextAnswer}
                >
                  <Send size={16} />
                  Submit Solution
                </Button>
              </div>
            </div>
          </div>
        )

      case "BehavioralQuestion":
        return (
          <div className="grid lg:grid-cols-2 h-full">
            <div className="overflow-y-auto border-r border-gray-800 p-6 space-y-6">
              {renderUserMediaSection()}
              <div className="overflow-y-auto">
                {renderQuestionDescription()}
                <div className="p-6 pt-0">
                  <div className="bg-gray-900 rounded-lg p-4 mb-4">
                    <h3 className="text-white text-lg mb-2">Response Tips:</h3>
                    <ul className="list-disc list-inside text-gray-300">
                      <li>Use the STAR method (Situation, Task, Action, Result)</li>
                      <li>Be specific about your role and contributions</li>
                      <li>Quantify results when possible</li>
                      <li>Keep your answer concise and relevant</li>
                      <li>Reflect on what you learned from the experience</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full flex flex-col">
              <div className="flex-1 p-6 overflow-y-auto">
                <Textarea
                  placeholder="Type your response here..."
                  className="w-full h-full min-h-[calc(100vh-250px)] bg-gray-900 border-gray-700 text-white p-4 resize-none"
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                />
              </div>
              <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
                  onClick={handleSubmitTextAnswer}
                >
                  <Send size={16} />
                  Submit Response
                </Button>
              </div>
            </div>
          </div>
        )

      case "CodingQuestion":
      default:
        return (
          <div className="grid lg:grid-cols-2 h-full">
            <div className="overflow-y-auto border-r border-gray-800 p-6 space-y-6">
              {renderUserMediaSection()}
              <div className="overflow-y-auto border-r border-gray-800">
                {question && (
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-white mb-6">{question.title}</h1>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 whitespace-pre-wrap break-words">{question.description}</p>
                      {question.examples?.map((example, index) => renderExample(example, index))}
                      {question.constraints && renderConstraints(question.constraints)}
                      {question.testCases && renderTestCases(question.testCases)}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="h-full">
              <CodeEditor
                onSubmit={(code) => {
                  if (question) {
                    updateCompletedQuestions(question._id)
                    submitAnswer(question._id, code)
                    // go back to previous page without reloading
                    if (typeof window !== "undefined") {
                      window.history.back()
                    }
                  }
                  console.log("Code submitted")
                }}
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {renderHeader()}
      <main className="pt-16 lg:h-[calc(100vh-64px)]">{renderQuestionContent()}</main>
    </div>
  )
}