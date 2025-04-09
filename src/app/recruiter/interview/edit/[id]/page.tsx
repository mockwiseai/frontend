"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Trash2 } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { Interview, QuestionType } from "@/types"
import { useAuth } from "@/hooks/useAuth"
import AddQuestionDialog from "@/components/recruiter/AddQuestion"
import { useEffect, useState } from "react"
import api from "@/services/api"

export default function EditInterview() {
    const router = useRouter()
    const params = useParams();
    const { toast } = useToast()
    const { isLoading, user } = useAuth()
    const [isLoaded, setIsLoaded] = useState(false)

    const form = useForm<any>({
        defaultValues: {
            title: "",
            description: "",
            duration: "60",
            jobRole: "",
            totalTime: 60,
            questions: [],
            status: "draft",
            createdAt: new Date().toISOString(),
        },
    })

    // Fetch interview data
    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const response = await api.get(`/api/recruiter/interviews/${params.id}`)
                const interviewData = response.data?.data;
                
                // Format the data for the form
                form.reset({
                    ...interviewData,
                    duration: interviewData.totalTime.toString(),
                    totalTime: interviewData.totalTime || interviewData.duration,
                    questions: interviewData.questions || [],
                })

                setIsLoaded(true)
            } catch (error: any) {
                console.error("Error fetching interview:", error)
                toast({
                    title: "Error",
                    description: error.response?.data?.message || "Failed to load the interview.",
                    variant: "destructive",
                })
                // router.push("/recruiter/dashboard")
            }
        }

        fetchInterview()
    }, [params.id, form, router, toast])

    // Update Interview API Call
    const updateInterview = async (data: Interview, status: "draft" | "published") => {
        try {
            const response = await api.put(`/api/recruiter/interviews/${params.id}`, {
                ...data,
                status,
                questions: data.questions.map((question: QuestionType) => ({
                    ...question,
                    questionId: question?._id || undefined,
                    questionType: "CodingQuestion", // Replace with the actual question type
                })),
                totalTime: data.duration,
                recruiterId: user?.id || "6783523dd7848b25598e6a8c", // Replace with the actual recruiter ID from auth context/session
            })

            const { data: updatedInterview } = response

            toast({
                title: status === "draft" ? "Draft Updated" : "Interview Updated",
                description:
                    status === "draft"
                        ? "Your interview has been updated and saved as a draft."
                        : `Your interview has been updated and published. Share link: ${updatedInterview.shareLink}`,
            })

            router.push("/recruiter/dashboard")
        } catch (error: any) {
            console.error("Error updating interview:", error)
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update the interview.",
                variant: "destructive",
            })
        }
    }

    // Submit Interview
    const onSubmit = (data: Interview) => {
        updateInterview(data, "published")
    }

    // Save as Draft
    const saveDraft = () => {
        const data = form.getValues()
        updateInterview(data, "draft")
    }

    // Add Question
    const handleAddQuestion = async (question: any) => {
        const questions = form.getValues("questions")
        form.setValue("questions", [...questions, question])
    }

    const removeQuestion = (index: number) => {
        const questions = form.getValues("questions")
        form.setValue(
            "questions",
            questions.filter((_: any, i: number) => i !== index),
        )
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4">Loading interview data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link href="/recruiter/dashboard">
                        <Button variant="ghost" className="gap-2 text-gray-300">
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Button>
                    </Link>
                </div>

                <Card className="max-w-4xl mx-auto p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
                    <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                        Edit Interview
                    </h1>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Interview Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">Interview Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Senior Frontend Developer Interview"
                                                {...field}
                                                className="bg-gray-900/50 border-gray-700 text-white"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Job Role */}
                            <FormField
                                control={form.control}
                                name="jobRole"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">Job Role</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Frontend Developer"
                                                {...field}
                                                className="bg-gray-900/50 border-gray-700 text-white"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the interview process and requirements..."
                                                {...field}
                                                className="bg-gray-900/50 border-gray-700 text-white"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Duration */}
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">Duration (minutes)</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                                                    <SelectValue placeholder="Select duration" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="30">30 minutes</SelectItem>
                                                    <SelectItem value="60">1 hour</SelectItem>
                                                    <SelectItem value="90">1.5 hours</SelectItem>
                                                    <SelectItem value="120">2 hours</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <div>
                                <div className="flex justify-between items-center text-[#ffff]">
                                    <h2>Questions</h2>
                                    <AddQuestionDialog onAdd={handleAddQuestion} />
                                </div>

                                {form.watch("questions").map((question: any, index: number) => (
                                    <Card key={index} className="p-4 my-4 bg-gray-900/50 border-gray-700 !text-[#ffff]">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="!text-[#ffff]">{question.title}</h3>
                                                <p className="!text-[#ffff]">{question.description}</p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeQuestion(index)}
                                                className="text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={saveDraft}
                                    className="bg-indigo-600 hover:bg-indigo-700 border-none text-white"
                                >
                                    Save as Draft
                                </Button>
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                                    Update Interview
                                </Button>
                            </div>
                        </form>
                    </Form>
                </Card>
            </div>
        </div>
    )
}
