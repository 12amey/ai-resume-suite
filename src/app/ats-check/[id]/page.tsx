"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
  Target,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ATSIssue {
  type: "error" | "warning" | "success";
  category: string;
  message: string;
  suggestion: string;
}

interface KeywordAnalysis {
  found: string[];
  missing: string[];
  repeated: string[];
}

interface ScoreBreakdown {
  category: string;
  score: number;
  max: number;
}

interface ATSAnalysis {
  atsScore: number;
  issues: ATSIssue[];
  keywordAnalysis: KeywordAnalysis;
  scoreBreakdown: ScoreBreakdown[];
  overallAssessment: string;
}

export default function ATSCheckPage({ params }: { params: { id: string } }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);

  // Mock resume data - in real app, fetch from database based on params.id
  const resumeData = {
    personal: {
      name: "John Doe",
      title: "Software Engineer",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/johndoe",
      website: "johndoe.com"
    },
    summary: "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies.",
    experience: [
      {
        company: "Tech Corp",
        position: "Senior Software Engineer",
        duration: "2021 - Present",
        achievements: [
          "Led development of microservices architecture serving 1M+ users",
          "Improved application performance by 40% through optimization",
          "Mentored team of 5 junior developers"
        ]
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        school: "University of California",
        year: "2015 - 2019",
        gpa: "3.8"
      }
    ],
    skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"]
  };

  useEffect(() => {
    // Auto-analyze on mount with delay
    const timer = setTimeout(() => {
      handleAnalyze();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/ats-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          resumeData,
          jobTitle: "Software Engineer"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      const data = await response.json();
      
      // Transform API response to match frontend format
      const transformedAnalysis: ATSAnalysis = {
        atsScore: data.score || 0,
        issues: data.issues?.map((issue: any) => ({
          type: issue.type,
          category: issue.title,
          message: issue.description,
          suggestion: issue.suggestion
        })) || [],
        keywordAnalysis: data.keywords || { found: [], missing: [], repeated: [] },
        scoreBreakdown: [
          { category: "Formatting", score: data.scoreBreakdown?.formatting || 0, max: 100 },
          { category: "Keywords", score: data.scoreBreakdown?.keywords || 0, max: 100 },
          { category: "Content Quality", score: data.scoreBreakdown?.content || 0, max: 100 },
          { category: "Experience", score: data.scoreBreakdown?.experience || 0, max: 100 }
        ],
        overallAssessment: data.score >= 80 
          ? "Your resume is well-optimized for ATS systems. It has strong keyword coverage, proper formatting, and clear content structure."
          : data.score >= 60
          ? "Your resume is decent but has room for improvement. Focus on adding relevant keywords and improving formatting."
          : "Your resume needs significant improvements to pass through ATS systems effectively. Review the issues and suggestions carefully."
      };
      
      setAnalysis(transformedAnalysis);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  const atsScore = analysis?.atsScore || 0;
  const issues = analysis?.issues || [];
  const keywordAnalysis = analysis?.keywordAnalysis || { found: [], missing: [], repeated: [] };
  const scoreBreakdown = analysis?.scoreBreakdown || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-4 mb-8"
          >
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </motion.div>

          {/* Score Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Card className="p-8 mb-8 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5 border-purple-500/20">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Score Circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.5, type: "spring" }}
                  className="relative"
                >
                  <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${getScoreGradient(atsScore)} p-1`}>
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getScoreColor(atsScore)}`}>
                          {isAnalyzing ? "..." : atsScore}
                        </div>
                        <div className="text-sm text-muted-foreground">ATS Score</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-full">
                    <Target className="w-5 h-5" />
                  </div>
                </motion.div>

                {/* Score Info */}
                <div className="flex-1 text-center md:text-left">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.8 }}
                    className="text-3xl font-bold mb-2"
                  >
                    {isAnalyzing ? "Analyzing..." : atsScore >= 80 ? "Excellent" : atsScore >= 60 ? "Good" : "Needs Improvement"}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 2 }}
                    className="text-lg text-muted-foreground mb-6"
                  >
                    {isAnalyzing 
                      ? "Please wait while AI analyzes your resume..."
                      : `Your resume has a ${atsScore >= 80 ? "high" : atsScore >= 60 ? "moderate" : "low"} chance of passing through Applicant Tracking Systems`}
                  </motion.p>

                  {!isAnalyzing && analysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 2.2 }}
                      className="flex flex-wrap gap-4 justify-center md:justify-start"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm">
                          {issues.filter(i => i.type === "success").length} Passed
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm">
                          {issues.filter(i => i.type === "warning").length} Warnings
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="text-sm">
                          {issues.filter(i => i.type === "error").length} Issues
                        </span>
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 2.4 }}
                  >
                    <Button
                      size="lg"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {isAnalyzing ? (
                        <>
                          <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                          Analyzing with AI...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Re-analyze Resume
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Tabs */}
          {!isAnalyzing && analysis && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.6 }}
            >
              <Tabs defaultValue="issues" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="issues">Issues & Suggestions</TabsTrigger>
                  <TabsTrigger value="keywords">Keywords</TabsTrigger>
                  <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
                </TabsList>

                {/* Issues Tab */}
                <TabsContent value="issues" className="space-y-4">
                  {issues.length === 0 ? (
                    <Card className="p-6">
                      <p className="text-center text-muted-foreground">No issues found. Your resume looks great!</p>
                    </Card>
                  ) : (
                    issues.map((issue, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 2.8 + index * 0.1 }}
                      >
                        <Card className="p-6">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 mt-1">
                              {issue.type === "success" && (
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                              )}
                              {issue.type === "warning" && (
                                <AlertCircle className="w-6 h-6 text-yellow-500" />
                              )}
                              {issue.type === "error" && (
                                <XCircle className="w-6 h-6 text-red-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold">{issue.category}</h3>
                                <Badge
                                  variant={
                                    issue.type === "success"
                                      ? "secondary"
                                      : issue.type === "warning"
                                      ? "secondary"
                                      : "destructive"
                                  }
                                  className={
                                    issue.type === "success"
                                      ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                      : issue.type === "warning"
                                      ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                                      : ""
                                  }
                                >
                                  {issue.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {issue.message}
                              </p>
                              <div className="flex items-start gap-2 mt-3 p-3 bg-muted/50 rounded-lg">
                                <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm">{issue.suggestion}</p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </TabsContent>

                {/* Keywords Tab */}
                <TabsContent value="keywords" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <h3 className="font-semibold">Found Keywords ({keywordAnalysis.found.length})</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {keywordAnalysis.found.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No keywords identified yet</p>
                        ) : (
                          keywordAnalysis.found.map((keyword) => (
                            <Badge
                              key={keyword}
                              className="bg-green-500/10 text-green-700 dark:text-green-400"
                            >
                              {keyword}
                            </Badge>
                          ))
                        )}
                      </div>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <XCircle className="w-5 h-5 text-red-500" />
                        <h3 className="font-semibold">Missing Keywords ({keywordAnalysis.missing.length})</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        These keywords are commonly found in similar job descriptions
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {keywordAnalysis.missing.length === 0 ? (
                          <p className="text-sm text-muted-foreground">All important keywords are present!</p>
                        ) : (
                          keywordAnalysis.missing.map((keyword) => (
                            <Badge
                              key={keyword}
                              variant="destructive"
                              className="bg-red-500/10 text-red-700 dark:text-red-400"
                            >
                              {keyword}
                            </Badge>
                          ))
                        )}
                      </div>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-semibold">Repeated Keywords ({keywordAnalysis.repeated.length})</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        These keywords appear multiple times and may seem repetitive
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {keywordAnalysis.repeated.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No keyword repetition issues</p>
                        ) : (
                          keywordAnalysis.repeated.map((keyword) => (
                            <Badge
                              key={keyword}
                              className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                            >
                              {keyword}
                            </Badge>
                          ))
                        )}
                      </div>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Score Breakdown Tab */}
                <TabsContent value="breakdown" className="space-y-4">
                  {scoreBreakdown.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    >
                      <Card className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">{item.category}</h3>
                          <span className={`text-lg font-bold ${getScoreColor(item.score)}`}>
                            {item.score}/{item.max}
                          </span>
                        </div>
                        <Progress value={item.score} className="h-3" />
                      </Card>
                    </motion.div>
                  ))}

                  {analysis.overallAssessment && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                    >
                      <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/20">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400 mt-1" />
                          <div>
                            <h3 className="font-semibold mb-2">Overall Assessment</h3>
                            <p className="text-sm text-muted-foreground">
                              {analysis.overallAssessment}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}