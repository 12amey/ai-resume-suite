"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  MoreVertical,
  FileText,
  Download,
  Share2,
  Copy,
  Trash2,
  Edit,
  Target,
  Calendar,
  Trophy,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface Resume {
  id: string;
  name: string;
  lastUpdated: string;
  thumbnail: string;
  atsScore?: number;
}

export default function Dashboard() {
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: "1",
      name: "Software Engineer Resume",
      lastUpdated: "2 hours ago",
      thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop",
      atsScore: 85,
    },
    {
      id: "2",
      name: "Product Manager CV",
      lastUpdated: "1 day ago",
      thumbnail: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400&h=500&fit=crop",
      atsScore: 92,
    },
    {
      id: "3",
      name: "Marketing Specialist Resume",
      lastUpdated: "3 days ago",
      thumbnail: "https://images.unsplash.com/photo-1586281380614-31b5aa852e58?w=400&h=500&fit=crop",
      atsScore: 78,
    },
  ]);

  const [showNewResumeDialog, setShowNewResumeDialog] = useState(false);
  const [newResumeName, setNewResumeName] = useState("");

  const handleCreateResume = () => {
    if (newResumeName.trim()) {
      const newResume: Resume = {
        id: Date.now().toString(),
        name: newResumeName,
        lastUpdated: "Just now",
        thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop",
      };
      setResumes([newResume, ...resumes]);
      setNewResumeName("");
      setShowNewResumeDialog(false);
    }
  };

  const handleDuplicate = (resume: Resume) => {
    const duplicated: Resume = {
      ...resume,
      id: Date.now().toString(),
      name: `${resume.name} (Copy)`,
      lastUpdated: "Just now",
    };
    setResumes([duplicated, ...resumes]);
  };

  const handleDelete = (id: string) => {
    setResumes(resumes.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Resumes</h1>
              <p className="text-muted-foreground">
                Manage and create your professional resumes
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-purple-500/20 hover:bg-purple-500/10"
              >
                <Link href="/achievements">
                  <Trophy className="w-5 h-5 mr-2" />
                  My Achievements
                </Link>
              </Button>
              <Button
                size="lg"
                onClick={() => setShowNewResumeDialog(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Resume
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 border-border/50 bg-gradient-to-br from-purple-500/5 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Resumes</p>
                  <p className="text-2xl font-bold">{resumes.length}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </Card>
            <Card className="p-6 border-border/50 bg-gradient-to-br from-blue-500/5 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg. ATS Score</p>
                  <p className="text-2xl font-bold">
                    {resumes.length > 0
                      ? Math.round(
                          resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0) /
                            resumes.filter((r) => r.atsScore).length
                        )
                      : 0}
                    %
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </Card>
            <Card className="p-6 border-border/50 bg-gradient-to-br from-green-500/5 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                  <p className="text-2xl font-bold">Today</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </Card>
          </div>

          {/* Resume Grid */}
          {resumes.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first resume to get started
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={() => setShowNewResumeDialog(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Resume
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/achievements">
                    <Trophy className="w-5 h-5 mr-2" />
                    Add Achievements First
                  </Link>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <Card
                  key={resume.id}
                  className="overflow-hidden border-border/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-950 dark:to-blue-950 overflow-hidden">
                    <img
                      src={resume.thumbnail}
                      alt={resume.name}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                    />
                    {resume.atsScore && (
                      <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {resume.atsScore}%
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate mb-1">
                          {resume.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Updated {resume.lastUpdated}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDuplicate(resume)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(resume.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <Button asChild className="w-full">
                        <Link href={`/builder/${resume.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Resume
                        </Link>
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/ats-check/${resume.id}`}>
                            <Target className="w-4 h-4 mr-1" />
                            ATS
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* New Resume Dialog */}
      <Dialog open={showNewResumeDialog} onOpenChange={setShowNewResumeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              Give your resume a name to get started
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="resume-name">Resume Name</Label>
            <Input
              id="resume-name"
              placeholder="e.g., Software Engineer Resume"
              value={newResumeName}
              onChange={(e) => setNewResumeName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateResume()}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewResumeDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateResume}
              disabled={!newResumeName.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Create Resume
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}