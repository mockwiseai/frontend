"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Users, Calendar, Activity, Share2, ExternalLink, Trash2, Edit, Settings } from "lucide-react";
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
import api from "@/services/api";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { WobbleCard } from "@/components/ui/wobble-card";

export default function Dashboard() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [search, setSearch] = useState("");
  const [shareDialog, setShareDialog] = useState<{ open: boolean; link?: string }>({
    open: false,
  });
  const [trackDialog, setTrackDialog] = useState<{ open: boolean, candidates: any[], totalQuestions: number }>({
    open: false,
    candidates: [],
    totalQuestions: 0,
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
          <PlaceholdersAndVanishInputDemo search={search} setSearch={setSearch} />
          <div className="grid gap-4">
            {interviews
              ?.filter((interview) => interview.title.toLowerCase().includes(search.toLowerCase()))
              ?.map((interview) => (
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
                        onClick={() => setTrackDialog({ open: true, candidates: interview?.candidates || [], totalQuestions: interview.questions.length })}
                        className="gap-2 bg-indigo-600 hover:bg-indigo-700 border-none text-white"
                      >
                        <Settings className="w-4 h-4" />
                        Track
                      </Button>
                    )}
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
      <TrackDialog trackDialog={trackDialog} setTrackDialog={setTrackDialog} candidates={trackDialog.candidates} />
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

function TrackDialog({ trackDialog, setTrackDialog, candidates }: { trackDialog: any; setTrackDialog: any; candidates: any[] }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">Completed</span>
      case "in-progress":
        return <span className="px-2 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-400">In Progress</span>
      case "not-started":
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">Not Started</span>
      default:
        return null
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
  }

  return (
    <Dialog open={trackDialog.open} onOpenChange={(open) => setTrackDialog({ open })}>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-gray-200">Track Interview Progress</DialogTitle>
          <DialogDescription className="text-gray-400">
            Monitor candidate progress and performance in this interview
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-left">
                <th className="pb-2 text-sm font-medium text-gray-400">Candidate</th>
                <th className="pb-2 text-sm font-medium text-gray-400">Progress</th>
                <th className="pb-2 text-sm font-medium text-gray-400">Status</th>
                <th className="pb-2 text-sm font-medium text-gray-400">Last Active</th>
                <th className="pb-2 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates?.map((candidate, i) => (
                <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-200">{candidate.name}</span>
                      <span className="text-xs text-gray-400">{candidate.email}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-200">
                          {candidate?.questionsAttempted || 0}/{trackDialog.totalQuestions} questions
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full"
                          style={{ width: `${(candidate.questionsAttempted / trackDialog.totalQuestions) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">{getStatusBadge(candidate.status)}</td>
                  <td className="py-4 text-sm text-gray-400">{formatDate(candidate.lastActive)}</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 bg-indigo-600 hover:bg-indigo-700 border-none text-white"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {candidates?.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No candidates have attempted this interview yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
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
    <div
      className="p-6 rounded-xl border border-gray-700"
    >

      <div className="flex items-center gap-4">
        {icon}
        <div>
          <p className="text-sm ">{title}</p>
          <p className="text-2xl font-bold text-gray-200">{value}</p>
        </div>
      </div>

    </div>
  );
}

function PlaceholdersAndVanishInputDemo({
  search,
  setSearch
}: {
  search?: string;
  setSearch?: (search: string) => void;
}) {
  const placeholders = [
    "Search by candidate name",
    "Filter by status",
    "Sort by date",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch
      ? setSearch(e.target.value)
      : console.log("search", e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("search", search);
  };
  return (
    <div className="flex w-full justify-start items-start my-3 px-4">
      <div className="flex w-[600px] justify-start items-start my-3 px-4">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
