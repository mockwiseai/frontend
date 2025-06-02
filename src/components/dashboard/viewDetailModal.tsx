"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Download, ExternalLink, FileText, MessageSquare, Video } from 'lucide-react'

interface ViewDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidate: {
    name: string
    email: string
    status: string
    questionsAttempted: number
    totalQuestions: number
    submittedAt: string | null
    answers?: Array<{
      questionId: string
      questionText: string
      answer: string
      score?: number
      feedback?: string
    }>
    recordings?: Array<{
      questionId: string
      questionText: string
      url: string
      duration: string
    }>
  }
}

export function ViewDetailsModal({ open, onOpenChange, candidate }: ViewDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-none">Completed</Badge>
      case "in-progress":
        return (
          <Badge className="bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 border-none">In Progress</Badge>
        )
      case "not-started":
        return <Badge className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 border-none">Not Started</Badge>
      default:
        return null
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not submitted yet"
    return new Date(dateString).toLocaleString()
  }

  const progressPercentage = Math.round((candidate.questionsAttempted / candidate.totalQuestions) * 100)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-200 flex items-center justify-between">
            <span>Candidate Details</span>
            {getStatusBadge(candidate.status)}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Detailed information about {candidate.name}'s interview performance
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 mb-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h3 className="font-medium text-gray-200 text-lg">{candidate.name}</h3>
              <p className="text-sm text-gray-400">{candidate.email}</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Last activity: {formatDate(candidate.submittedAt)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-200">Progress</span>
              <span className="text-sm text-gray-200">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-gray-700">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </Progress>
            <p className="text-xs text-gray-400 mt-1">
              {candidate.questionsAttempted} of {candidate.totalQuestions} questions completed
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-900/50 border border-gray-700 grid grid-cols-3 mb-4">
            <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="answers" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Answers
            </TabsTrigger>
            <TabsTrigger
              value="recordings"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Recordings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <Card className="bg-gray-900/50 border-gray-700 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Status</span>
                      <span className="text-sm text-gray-200">{candidate.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Questions Attempted</span>
                      <span className="text-sm text-gray-200">
                        {candidate.questionsAttempted} of {candidate.totalQuestions}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Completion Rate</span>
                      <span className="text-sm text-gray-200">{progressPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Submitted At</span>
                      <span className="text-sm text-gray-200">{formatDate(candidate.submittedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Actions</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border-indigo-800"
                    >
                      <Download className="w-4 h-4" />
                      Export Results
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border-indigo-800"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Send Feedback
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="answers" className="mt-0">
            <Card className="bg-gray-900/50 border-gray-700 p-4">
              <div className="space-y-4">
                {candidate.answers && candidate.answers.length > 0 ? (
                  candidate.answers.map((answer, index) => (
                    <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-medium text-gray-200">Question {index + 1}</h4>
                        {answer.score !== undefined && (
                          <Badge className="bg-indigo-600 hover:bg-indigo-700">Score: {answer.score}/10</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{answer.questionText}</p>
                      <div className="p-3 bg-gray-900 rounded border border-gray-700 mb-2">
                        <h5 className="text-xs font-medium text-gray-400 mb-1">Answer:</h5>
                        <p className="text-sm text-gray-200 whitespace-pre-wrap">{answer.answer}</p>
                      </div>
                      {answer.feedback && (
                        <div className="p-3 bg-indigo-900/20 rounded border border-indigo-800/50">
                          <h5 className="text-xs font-medium text-indigo-400 mb-1">Feedback:</h5>
                          <p className="text-sm text-gray-200">{answer.feedback}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">No answers available for this candidate.</div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="recordings" className="mt-0">
            <Card className="bg-gray-900/50 border-gray-700 p-4">
              <div className="space-y-4">
                {candidate.recordings && candidate.recordings.length > 0 ? (
                  candidate.recordings.map((recording, index) => (
                    <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-medium text-gray-200">Question {index + 1}</h4>
                        <Badge className="bg-gray-700 text-gray-300 hover:bg-gray-600 border-none">
                          {recording.duration}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{recording.questionText}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-indigo-400" />
                          <span className="text-sm text-gray-200">Video Response</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 bg-indigo-600 hover:bg-indigo-700 border-none text-white"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Play
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">No recordings available for this candidate.</div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-700 text-gray-200 hover:bg-gray-700"
          >
            Close
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
