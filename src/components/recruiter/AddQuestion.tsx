"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API_BASE_URL } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function AddQuestionDialog({ onAdd }: { onAdd: (question: any) => void }) {
    const { toast } = useToast();
    const [showDialog, setShowDialog] = useState(false);
    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
            difficulty: "easy",
            examples: [],
            testCases: [],
        },
    });

    const onSubmit = async (data: any) => {
        if (!data.title || !data.description) {
            return;
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/recruiter/interviews/questions`, data);
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
            <DialogContent className="bg-gray-900/50 border-gray-700 !text-[#ffff]">
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
                        <Button type="button" onClick={(e) => {
                        form.handleSubmit(onSubmit)(e);
                    }}>Add Question</Button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
