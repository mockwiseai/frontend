"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import api from "@/services/api";

export default function AddQuestionDialog({ onAdd }: { onAdd: (question: any) => void }) {
    const { toast } = useToast();
    const [showDialog, setShowDialog] = useState(false);
    const [exampleInput, setExampleInput] = useState("");
    const [exampleOutput, setExampleOutput] = useState("");
    const [testCaseInput, setTestCaseInput] = useState("");
    const [testCaseOutput, setTestCaseOutput] = useState("");
    
    const form = useForm<any>
    ({
        defaultValues: {
            title: "",
            description: "",
            difficulty: "easy",
            examples: [],
            testCases: [],
        },
    });

    const formValues = form.watch();

    const addExample = () => {
        if (exampleInput.trim() === "" || exampleOutput.trim() === "") return;
        
        const newExample = {
            input: exampleInput,
            output: exampleOutput
        };
        
        const currentExamples = form.getValues("examples") || [];
        form.setValue("examples", [...currentExamples, newExample]);
        
        // Clear input fields
        setExampleInput("");
        setExampleOutput("");
    };

    const removeExample = (index: number) => {
        const currentExamples = form.getValues("examples") || [];
        form.setValue(
            "examples",
            currentExamples.filter((_: any, i: any) => i !== index)
        );
    };

    const addTestCase = () => {
        if (testCaseInput.trim() === "" || testCaseOutput.trim() === "") return;
        
        const newTestCase = {
            input: testCaseInput,
            output: testCaseOutput
        };
        
        const currentTestCases = form.getValues("testCases") || [];
        form.setValue("testCases", [...currentTestCases, newTestCase]);
        
        // Clear input fields
        setTestCaseInput("");
        setTestCaseOutput("");
    };

    const removeTestCase = (index: number) => {
        const currentTestCases = form.getValues("testCases") || [];
        form.setValue(
            "testCases",
            currentTestCases.filter((_: any, i: any) => i !== index)
        );
    };

    const onSubmit = async (data: any) => {
        if (!data.title || !data.description) {
            toast({
                title: "Missing Fields",
                description: "Title and description are required.",
                variant: "destructive",
            });
            return;
        }
        
        try {
            const response = await api.post(`/api/recruiter/interviews/questions`, data);
            onAdd(response.data.data); // Pass the added question back to the parent
            toast({
                title: "Question Added",
                description: "Your question has been added successfully.",
            });
            // Reset the form & close the dialog
            form.reset();
            form.clearErrors();
            setShowDialog(false);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to add the question.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={showDialog} onOpenChange={() => setShowDialog(!showDialog)}>
            <DialogTrigger asChild>
                <Button type="button" onClick={() => setShowDialog(true)}>Add Question</Button>
            </DialogTrigger>
            <DialogContent className=" !text-[#ffff] max-w-xl bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <Form {...form}>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Question title" {...field} className="bg-gray-900/50 border-gray-700 !text-[#ffff]" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Question description" {...field} className="bg-gray-900/50 border-gray-700 !text-[#ffff]" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="difficulty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Difficulty</FormLabel>
                                    <FormControl>
                                        <select {...field} className="w-full p-2 rounded bg-gray-900/50 border-gray-700 !text-[#ffff]">
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Examples Section */}
                        <div>
                            <FormLabel>Examples</FormLabel>
                            <div className="flex flex-col space-y-2">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Example input"
                                        value={exampleInput}
                                        onChange={(e) => setExampleInput(e.target.value)}
                                        className="bg-gray-900/50 border-gray-700 !text-[#ffff]"
                                    />
                                    <Input
                                        placeholder="Example output"
                                        value={exampleOutput}
                                        onChange={(e) => setExampleOutput(e.target.value)}
                                        className="bg-gray-900/50 border-gray-700 !text-[#ffff]"
                                    />
                                    <Button 
                                        type="button" 
                                        onClick={addExample}
                                        size="icon"
                                        className="flex-shrink-0"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                
                                {/* Display added examples */}
                                {formValues.examples && formValues.examples.length > 0 && (
                                    <div className="mt-2">
                                        <h4 className="text-sm font-medium mb-1">Added Examples:</h4>
                                        <div className="space-y-2">
                                            {formValues.examples.map((example: any, index: any) => (
                                                <div key={index} className="flex items-center gap-2 p-2 border border-gray-700 rounded bg-gray-900/30">
                                                    <div className="flex-1">
                                                        <p className="text-xs text-gray-400">Input:</p>
                                                        <p className="text-sm">{example.input}</p>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs text-gray-400">Output:</p>
                                                        <p className="text-sm">{example.output}</p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeExample(index)}
                                                        className="h-6 w-6"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Test Cases Section */}
                        <div>
                            <FormLabel>Test Cases</FormLabel>
                            <div className="flex flex-col space-y-2">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Test case input"
                                        value={testCaseInput}
                                        onChange={(e) => setTestCaseInput(e.target.value)}
                                        className="bg-gray-900/50 border-gray-700 !text-[#ffff]"
                                    />
                                    <Input
                                        placeholder="Test case output"
                                        value={testCaseOutput}
                                        onChange={(e) => setTestCaseOutput(e.target.value)}
                                        className="bg-gray-900/50 border-gray-700 !text-[#ffff]"
                                    />
                                    <Button 
                                        type="button" 
                                        onClick={addTestCase}
                                        size="icon"
                                        className="flex-shrink-0"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                
                                {/* Display added test cases */}
                                {formValues.testCases && formValues.testCases.length > 0 && (
                                    <div className="mt-2">
                                        <h4 className="text-sm font-medium mb-1">Added Test Cases:</h4>
                                        <div className="space-y-2">
                                            {formValues.testCases.map((testCase: any, index: any) => (
                                                <div key={index} className="flex items-center gap-2 p-2 border border-gray-700 rounded bg-gray-900/30">
                                                    <div className="flex-1">
                                                        <p className="text-xs text-gray-400">Input:</p>
                                                        <p className="text-sm">{testCase.input}</p>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs text-gray-400">Output:</p>
                                                        <p className="text-sm">{testCase.output}</p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeTestCase(index)}
                                                        className="h-6 w-6"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button 
                            type="button" 
                            onClick={form.handleSubmit(onSubmit)}
                            className="w-full mt-4"
                        >
                            Add Question
                        </Button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}