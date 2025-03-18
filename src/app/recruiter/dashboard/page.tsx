"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Users, Calendar, Activity, Share2, ExternalLink, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Interview } from "@/types";
import axios from "axios";
import { API_BASE_URL } from "@/lib/utils";
import api from "@/services/api";

export default function Dashboard() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [shareDialog, setShareDialog] = useState<{ open: boolean; link?: string }>({
    open: false,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; interview?: Interview }>({
    open: false,
  });
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await api.get(`/api/recruiter/interviews`);
      setInterviews(response.data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch interviews",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (interview: Interview) => {
    setDeleteDialog({ open: true, interview });
  };

  const confirmDelete = async () => {
    if (deleteDialog.interview) {
      try {
        await api.delete(`/api/recruiter/interviews/${deleteDialog.interview._id}`);
        setInterviews(interviews.filter(i => i._id !== deleteDialog.interview?._id));
        toast({
          title: "Interview deleted",
          description: `${deleteDialog.interview.status === 'draft' ? 'Draft' : 'Interview'} has been deleted successfully`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete interview",
          variant: "destructive",
        });
      } finally {
        setDeleteDialog({ open: false });
      }
    }
  };

  const handleEdit = (interview: Interview) => {
    router.push(`/dashboard/edit/${interview._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Interview Dashboard
          </h1>
          <Link href="/recruiter/interview/create">
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4" /> Create Interview
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Interviews"
            value={interviews.length.toString()}
            icon={<Calendar className="w-8 h-8 text-indigo-500" />}
          />
          <StatCard
            title="Published Interviews"
            value={interviews.filter(i => i.status === "published").length.toString()}
            icon={<Users className="w-8 h-8 text-indigo-500" />}
          />
          <StatCard
            title="Draft Interviews"
            value={interviews.filter(i => i.status === "draft").length.toString()}
            icon={<Activity className="w-8 h-8 text-indigo-500" />}
          />
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Recent Interviews</h2>
          <div className="grid gap-4">
            {interviews.map((interview) => (
              <div
                key={interview._id}
                className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700"
              >
                <div>
                  <h3 className="font-medium text-gray-200">{interview.title}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(interview.createdAt).toLocaleDateString()} • {interview.questions.length} questions
                    • {interview.status === "draft" ? "Draft" : "Published"}
                  </p>
                </div>
                <div className="flex gap-2">
                  {interview.status === "published" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShareDialog({ open: true, link: "/live/" + interview?.uniqueLink })}
                      className="gap-2 bg-indigo-600 hover:bg-indigo-700 border-none text-white"
                    >
                      <Share2 className="w-4 h-4" /> Share
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => handleEdit(interview)}
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(interview)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {interviews.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No interviews created yet. Click "Create Interview" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
      <ShareDialog shareDialog={shareDialog} setShareDialog={setShareDialog} />
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-200">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {`Are you sure you want to delete this ${deleteDialog.interview?.status === 'draft' ? 'draft' : 'published interview'}? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 text-gray-200 hover:bg-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ShareDialog({ shareDialog, setShareDialog }: { shareDialog: any; setShareDialog: any }) {
  const { toast } = useToast();
  const [link, setLink] = useState("");

  useEffect(() => {
    if (typeof window !== undefined) {
      setLink(window.location.origin + shareDialog.link);
    }
  }, [shareDialog.link]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Link copied",
      description: "Interview link has been copied to clipboard",
    });
    // Close the dialog after copying
    setShareDialog({ open: false });
  };
  return (
    <Dialog open={shareDialog.open} onOpenChange={(open) => setShareDialog({ open })}>
      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-200">Share Interview</DialogTitle>
          <DialogDescription className="text-gray-400">
            Copy the link below to share this interview with candidates
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input
            value={link}
            readOnly
            className="bg-gray-900/50 border-gray-700 text-white"
          />
          <Button
            onClick={() => copyToClipboard(link)}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            <ExternalLink className="w-4 h-4" /> Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-200">{value}</p>
        </div>
      </div>
    </Card>
  );
}