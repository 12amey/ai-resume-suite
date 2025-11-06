"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  FileText,
  Briefcase,
  User,
  Mail,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AIGeneratorPage() {
  const [activeTab, setActiveTab] = useState("cover-letter");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Cover Letter State
  const [coverLetterInput, setCoverLetterInput] = useState({
    jobTitle: "Software Engineer",
    company: "Tech Corp",
    experience: "5 years",
    tone: "professional",
  });
  const [coverLetterOutput, setCoverLetterOutput] = useState("");

  // LinkedIn Summary State
  const [linkedInInput, setLinkedInInput] = useState({
    role: "Full Stack Developer",
    years: "5",
    skills: "React, Node.js, TypeScript",
    tone: "professional",
  });
  const [linkedInOutput, setLinkedInOutput] = useState("");

  // Job Description State
  const [jobDescInput, setJobDescInput] = useState({
    title: "Senior Software Engineer",
    department: "Engineering",
    type: "full-time",
  });
  const [jobDescOutput, setJobDescOutput] = useState("");

  // Bio State
  const [bioInput, setBioInput] = useState({
    name: "John Doe",
    profession: "Software Engineer",
    specialty: "Full-stack Development",
    tone: "professional",
  });
  const [bioOutput, setBioOutput] = useState("");

  const handleGenerate = async (type: string) => {
    setIsGenerating(true);
    setError("");
    
    try {
      let inputs;
      switch (type) {
        case "cover-letter":
          inputs = coverLetterInput;
          break;
        case "linkedin":
          inputs = linkedInInput;
          break;
        case "job-description":
          inputs = jobDescInput;
          break;
        case "bio":
          inputs = bioInput;
          break;
        default:
          throw new Error("Invalid type");
      }

      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, inputs }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content");
      }

      // Set the output based on type
      switch (type) {
        case "cover-letter":
          setCoverLetterOutput(data.content);
          break;
        case "linkedin":
          setLinkedInOutput(data.content);
          break;
        case "job-description":
          setJobDescOutput(data.content);
          break;
        case "bio":
          setBioOutput(data.content);
          break;
      }

      toast.success("Content generated successfully!");
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate content");
      toast.error(err.message || "Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered Content Generator
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Create{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Professional Content
              </span>
              <br />
              In Seconds
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Generate cover letters, LinkedIn summaries, job descriptions, and more with AI
            </p>
          </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-600 dark:text-red-400 font-medium">Error</p>
                <p className="text-red-600/80 dark:text-red-400/80 text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-muted/50">
                <TabsTrigger value="cover-letter" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                  <Mail className="w-4 h-4" />
                  <span className="hidden sm:inline">Cover Letter</span>
                  <span className="sm:hidden">Cover</span>
                </TabsTrigger>
                <TabsTrigger value="linkedin" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">LinkedIn</span>
                  <span className="sm:hidden">LinkedIn</span>
                </TabsTrigger>
                <TabsTrigger value="job-description" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
                  <Briefcase className="w-4 h-4" />
                  <span className="hidden sm:inline">Job Description</span>
                  <span className="sm:hidden">Job Desc</span>
                </TabsTrigger>
                <TabsTrigger value="bio" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Bio</span>
                  <span className="sm:hidden">Bio</span>
                </TabsTrigger>
              </TabsList>

              {/* Cover Letter Tab */}
              <TabsContent value="cover-letter">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <Card className="p-6 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                    <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Input Details</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="job-title" className="text-foreground">Job Title</Label>
                        <Input
                          id="job-title"
                          value={coverLetterInput.jobTitle}
                          onChange={(e) =>
                            setCoverLetterInput({ ...coverLetterInput, jobTitle: e.target.value })
                          }
                          placeholder="e.g., Software Engineer"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company" className="text-foreground">Company Name</Label>
                        <Input
                          id="company"
                          value={coverLetterInput.company}
                          onChange={(e) =>
                            setCoverLetterInput({ ...coverLetterInput, company: e.target.value })
                          }
                          placeholder="e.g., Tech Corp"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="experience" className="text-foreground">Years of Experience</Label>
                        <Input
                          id="experience"
                          value={coverLetterInput.experience}
                          onChange={(e) =>
                            setCoverLetterInput({ ...coverLetterInput, experience: e.target.value })
                          }
                          placeholder="e.g., 5 years"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tone" className="text-foreground">Tone</Label>
                        <Select
                          value={coverLetterInput.tone}
                          onValueChange={(value) =>
                            setCoverLetterInput({ ...coverLetterInput, tone: value })
                          }
                        >
                          <SelectTrigger id="tone" className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() => handleGenerate("cover-letter")}
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Cover Letter
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Generated Content</h2>
                      {coverLetterOutput && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(coverLetterOutput)}
                          className="border-purple-500/30 hover:bg-purple-500/10"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 mr-2 text-green-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    <Textarea
                      value={coverLetterOutput}
                      readOnly
                      placeholder="Your generated cover letter will appear here..."
                      className="min-h-[400px] font-mono text-sm resize-none"
                    />
                  </Card>
                </motion.div>
              </TabsContent>

              {/* LinkedIn Summary Tab */}
              <TabsContent value="linkedin">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <Card className="p-6 border-blue-500/20 hover:border-blue-500/40 transition-colors">
                    <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Input Details</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="role" className="text-foreground">Professional Role</Label>
                        <Input
                          id="role"
                          value={linkedInInput.role}
                          onChange={(e) =>
                            setLinkedInInput({ ...linkedInInput, role: e.target.value })
                          }
                          placeholder="e.g., Full Stack Developer"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="years" className="text-foreground">Years of Experience</Label>
                        <Input
                          id="years"
                          value={linkedInInput.years}
                          onChange={(e) =>
                            setLinkedInInput({ ...linkedInInput, years: e.target.value })
                          }
                          placeholder="e.g., 5"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="skills" className="text-foreground">Key Skills</Label>
                        <Input
                          id="skills"
                          value={linkedInInput.skills}
                          onChange={(e) =>
                            setLinkedInInput({ ...linkedInInput, skills: e.target.value })
                          }
                          placeholder="e.g., React, Node.js, TypeScript"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin-tone" className="text-foreground">Tone</Label>
                        <Select
                          value={linkedInInput.tone}
                          onValueChange={(value) =>
                            setLinkedInInput({ ...linkedInInput, tone: value })
                          }
                        >
                          <SelectTrigger id="linkedin-tone" className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="inspiring">Inspiring</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() => handleGenerate("linkedin")}
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Summary
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6 border-blue-500/20 hover:border-blue-500/40 transition-colors">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Generated Content</h2>
                      {linkedInOutput && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(linkedInOutput)}
                          className="border-blue-500/30 hover:bg-blue-500/10"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 mr-2 text-green-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    <Textarea
                      value={linkedInOutput}
                      readOnly
                      placeholder="Your generated LinkedIn summary will appear here..."
                      className="min-h-[400px] font-mono text-sm resize-none"
                    />
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Job Description Tab */}
              <TabsContent value="job-description">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <Card className="p-6 border-green-500/20 hover:border-green-500/40 transition-colors">
                    <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Input Details</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="job-title-jd" className="text-foreground">Job Title</Label>
                        <Input
                          id="job-title-jd"
                          value={jobDescInput.title}
                          onChange={(e) =>
                            setJobDescInput({ ...jobDescInput, title: e.target.value })
                          }
                          placeholder="e.g., Senior Software Engineer"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="department" className="text-foreground">Department</Label>
                        <Input
                          id="department"
                          value={jobDescInput.department}
                          onChange={(e) =>
                            setJobDescInput({ ...jobDescInput, department: e.target.value })
                          }
                          placeholder="e.g., Engineering"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="job-type" className="text-foreground">Employment Type</Label>
                        <Select
                          value={jobDescInput.type}
                          onValueChange={(value) =>
                            setJobDescInput({ ...jobDescInput, type: value })
                          }
                        >
                          <SelectTrigger id="job-type" className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() => handleGenerate("job-description")}
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Job Description
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6 border-green-500/20 hover:border-green-500/40 transition-colors">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Generated Content</h2>
                      {jobDescOutput && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(jobDescOutput)}
                          className="border-green-500/30 hover:bg-green-500/10"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 mr-2 text-green-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    <Textarea
                      value={jobDescOutput}
                      readOnly
                      placeholder="Your generated job description will appear here..."
                      className="min-h-[400px] font-mono text-sm resize-none"
                    />
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Bio Tab */}
              <TabsContent value="bio">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <Card className="p-6 border-orange-500/20 hover:border-orange-500/40 transition-colors">
                    <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Input Details</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-foreground">Full Name</Label>
                        <Input
                          id="name"
                          value={bioInput.name}
                          onChange={(e) =>
                            setBioInput({ ...bioInput, name: e.target.value })
                          }
                          placeholder="e.g., John Doe"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="profession" className="text-foreground">Profession</Label>
                        <Input
                          id="profession"
                          value={bioInput.profession}
                          onChange={(e) =>
                            setBioInput({ ...bioInput, profession: e.target.value })
                          }
                          placeholder="e.g., Software Engineer"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialty" className="text-foreground">Specialty/Focus</Label>
                        <Input
                          id="specialty"
                          value={bioInput.specialty}
                          onChange={(e) =>
                            setBioInput({ ...bioInput, specialty: e.target.value })
                          }
                          placeholder="e.g., Full-stack Development"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio-tone" className="text-foreground">Tone</Label>
                        <Select
                          value={bioInput.tone}
                          onValueChange={(value) =>
                            setBioInput({ ...bioInput, tone: value })
                          }
                        >
                          <SelectTrigger id="bio-tone" className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="creative">Creative</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() => handleGenerate("bio")}
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Bio
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6 border-orange-500/20 hover:border-orange-500/40 transition-colors">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Generated Content</h2>
                      {bioOutput && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(bioOutput)}
                          className="border-orange-500/30 hover:bg-orange-500/10"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 mr-2 text-green-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    <Textarea
                      value={bioOutput}
                      readOnly
                      placeholder="Your generated bio will appear here..."
                      className="min-h-[400px] font-mono text-sm resize-none"
                    />
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
}