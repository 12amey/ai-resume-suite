"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Plus,
  Trash2,
  Download,
  Eye,
  Save,
  ArrowLeft,
  Wand2,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";
import ResumePreview from "@/components/ResumePreview";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Array<{ id: string; name: string; description: string; link: string }>;
  certifications: Array<{ id: string; name: string; issuer: string; date: string }>;
}

export default function ResumeBuilder({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("personal");
  const [template, setTemplate] = useState("modern");
  const [showPreview, setShowPreview] = useState(true);
  const [isImproving, setIsImproving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  });

  // Fetch resume data on mount
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await fetch(`/api/resumes/${params.id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch resume data");
        }

        const data = await response.json();
        
        // Update state with fetched data
        setResumeData({
          personalInfo: data.personalInfo,
          experience: data.experience,
          education: data.education,
          skills: data.skills,
          projects: data.projects,
          certifications: data.certifications,
        });
        
        setTemplate(data.template || "modern");
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load resume data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumeData();
  }, [params.id]);

  const handleSyncAchievements = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch("/api/resumes/sync-achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: parseInt(params.id) }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to sync achievements");
      }

      const result = await response.json();
      
      toast.success(
        `✨ Synced ${result.experiencesAdded} experiences and ${result.skillsAdded} skills from your achievements!`
      );

      // Reload resume data
      window.location.reload();
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Failed to sync achievements. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save personal info
      await fetch("/api/personal-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: parseInt(params.id),
          ...resumeData.personalInfo,
        }),
      });

      // Update resume template
      await fetch(`/api/resumes?id=${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template }),
      });

      toast.success("Resume saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save resume");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.querySelector('[data-resume-preview]') as HTMLElement;
    if (!element) {
      toast.error("Preview not found");
      return;
    }

    try {
      toast.loading("Generating PDF...");

      // Capture the resume preview as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Download PDF
      const fileName = `${resumeData.personalInfo.fullName || 'Resume'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast.dismiss();
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.dismiss();
      toast.error("Failed to generate PDF");
    }
  };

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setResumeData({
      ...resumeData,
      personalInfo: { ...resumeData.personalInfo, [field]: value },
    });
  };

  const handleAIImprove = async (field: string, currentText: string, action: string = "improve") => {
    if (!currentText.trim()) {
      toast.error("Please enter some text first");
      return;
    }

    setIsImproving(true);
    try {
      const response = await fetch("/api/gemini/improve-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: currentText,
          context: field,
          action 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to improve text");
      }

      const data = await response.json();
      
      // Update the field with improved text
      if (field === "summary") {
        handlePersonalInfoChange("summary", data.improvedText);
      } else if (field.startsWith("experience-")) {
        const expId = field.split("-")[1];
        updateExperience(expId, "description", data.improvedText);
      }
      
      toast.success("Text improved successfully!");
    } catch (error) {
      console.error("Improvement error:", error);
      toast.error("Failed to improve text. Please try again.");
    } finally {
      setIsImproving(false);
    }
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setResumeData({ ...resumeData, experience: [...resumeData.experience, newExp] });
  };

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((exp) => exp.id !== id),
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      grade: "",
    };
    setResumeData({ ...resumeData, education: [...resumeData.education, newEdu] });
  };

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((edu) => edu.id !== id),
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData({ ...resumeData, skills: [...resumeData.skills, skill.trim()] });
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((s) => s !== skill),
    });
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: "",
      description: "",
      link: "",
    };
    setResumeData({ ...resumeData, projects: [...resumeData.projects, newProject] });
  };

  const removeProject = (id: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter((proj) => proj.id !== id),
    });
  };

  const updateProject = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const addCertification = () => {
    const newCert = {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      date: "",
    };
    setResumeData({
      ...resumeData,
      certifications: [...resumeData.certifications, newCert],
    });
  };

  const removeCertification = (id: string) => {
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.filter((cert) => cert.id !== id),
    });
  };

  const updateCertification = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="font-semibold">Resume Builder</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncAchievements}
                disabled={isSyncing}
                className="hidden lg:flex"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isSyncing ? "Syncing..." : "Sync Achievements"}
              </Button>

              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="hidden lg:flex"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? "Hide" : "Show"} Preview
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>

              <Button 
                size="sm" 
                onClick={handleDownloadPDF}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Sync Achievement Banner */}
            <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-purple-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Auto-populate from Achievements</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Automatically add your internships, hackathons, courses, and projects to this resume
                  </p>
                  <Button
                    size="sm"
                    onClick={handleSyncAchievements}
                    disabled={isSyncing}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {isSyncing ? "Syncing..." : "Sync Now"}
                  </Button>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-4 lg:grid-cols-6">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="certs">Certs</TabsTrigger>
              </TabsList>

              {/* Personal Info Tab */}
              <TabsContent value="personal" className="space-y-4 mt-6">
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={resumeData.personalInfo.fullName}
                          onChange={(e) =>
                            handlePersonalInfoChange("fullName", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="title">Professional Title</Label>
                        <Input
                          id="title"
                          value={resumeData.personalInfo.title}
                          onChange={(e) =>
                            handlePersonalInfoChange("title", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={resumeData.personalInfo.email}
                          onChange={(e) =>
                            handlePersonalInfoChange("email", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) =>
                            handlePersonalInfoChange("phone", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={resumeData.personalInfo.location}
                        onChange={(e) =>
                          handlePersonalInfoChange("location", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={resumeData.personalInfo.linkedin}
                          onChange={(e) =>
                            handlePersonalInfoChange("linkedin", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={resumeData.personalInfo.website}
                          onChange={(e) =>
                            handlePersonalInfoChange("website", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleAIImprove(
                                "summary",
                                resumeData.personalInfo.summary,
                                "improve"
                              )
                            }
                            disabled={isImproving}
                            className="text-purple-600 dark:text-purple-400"
                          >
                            <Sparkles className="w-4 h-4 mr-1" />
                            {isImproving ? "Improving..." : "AI Improve"}
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        id="summary"
                        value={resumeData.personalInfo.summary}
                        onChange={(e) =>
                          handlePersonalInfoChange("summary", e.target.value)
                        }
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Work Experience</h2>
                  <Button onClick={addExperience} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Experience
                  </Button>
                </div>

                {resumeData.experience.map((exp, index) => (
                  <Card key={exp.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Experience {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(exp.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) =>
                              updateExperience(exp.id, "company", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Position</Label>
                          <Input
                            value={exp.position}
                            onChange={(e) =>
                              updateExperience(exp.id, "position", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) =>
                              updateExperience(exp.id, "startDate", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) =>
                              updateExperience(exp.id, "endDate", e.target.value)
                            }
                            disabled={exp.current}
                            className="mt-1"
                          />
                          <label className="flex items-center gap-2 mt-2 text-sm">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) =>
                                updateExperience(exp.id, "current", e.target.checked)
                              }
                              className="rounded"
                            />
                            Currently working here
                          </label>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <Label>Description & Achievements</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleAIImprove(`experience-${exp.id}`, exp.description, "improve")
                            }
                            disabled={isImproving}
                            className="text-purple-600 dark:text-purple-400"
                          >
                            <Wand2 className="w-4 h-4 mr-1" />
                            {isImproving ? "Enhancing..." : "Enhance"}
                          </Button>
                        </div>
                        <Textarea
                          value={exp.description}
                          onChange={(e) =>
                            updateExperience(exp.id, "description", e.target.value)
                          }
                          rows={5}
                          placeholder="• Achievement 1&#10;• Achievement 2&#10;• Achievement 3"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Education</h2>
                  <Button onClick={addEducation} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Education
                  </Button>
                </div>

                {resumeData.education.map((edu, index) => (
                  <Card key={edu.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Education {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(edu.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>School/University</Label>
                        <Input
                          value={edu.school}
                          onChange={(e) =>
                            updateEducation(edu.id, "school", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) =>
                              updateEducation(edu.id, "degree", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Field of Study</Label>
                          <Input
                            value={edu.field}
                            onChange={(e) =>
                              updateEducation(edu.id, "field", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Start Year</Label>
                          <Input
                            value={edu.startDate}
                            onChange={(e) =>
                              updateEducation(edu.id, "startDate", e.target.value)
                            }
                            placeholder="2019"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>End Year</Label>
                          <Input
                            value={edu.endDate}
                            onChange={(e) =>
                              updateEducation(edu.id, "endDate", e.target.value)
                            }
                            placeholder="2023"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Grade/GPA</Label>
                          <Input
                            value={edu.grade}
                            onChange={(e) =>
                              updateEducation(edu.id, "grade", e.target.value)
                            }
                            placeholder="3.8"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills" className="space-y-4 mt-6">
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Skills</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Add Skill</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="new-skill"
                          placeholder="e.g., React, Python, Leadership"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              addSkill(e.currentTarget.value);
                              e.currentTarget.value = "";
                            }
                          }}
                        />
                        <Button
                          onClick={() => {
                            const input = document.getElementById(
                              "new-skill"
                            ) as HTMLInputElement;
                            if (input) {
                              addSkill(input.value);
                              input.value = "";
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Your Skills</Label>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="px-3 py-1 text-sm"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="ml-2 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Projects</h2>
                  <Button onClick={addProject} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Project
                  </Button>
                </div>

                {resumeData.projects.length === 0 ? (
                  <Card className="p-6">
                    <p className="text-sm text-muted-foreground text-center">
                      No projects added yet. Click "Add Project" to showcase your work.
                    </p>
                  </Card>
                ) : (
                  resumeData.projects.map((project, index) => (
                    <Card key={project.id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Project {index + 1}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProject(project.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label>Project Name</Label>
                          <Input
                            value={project.name}
                            onChange={(e) =>
                              updateProject(project.id, "name", e.target.value)
                            }
                            placeholder="e.g., E-commerce Platform"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={project.description}
                            onChange={(e) =>
                              updateProject(project.id, "description", e.target.value)
                            }
                            placeholder="Describe your project, technologies used, and key features..."
                            rows={4}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label>Project Link (Optional)</Label>
                          <Input
                            value={project.link}
                            onChange={(e) =>
                              updateProject(project.id, "link", e.target.value)
                            }
                            placeholder="https://github.com/username/project or live demo URL"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Certifications Tab */}
              <TabsContent value="certs" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Certifications</h2>
                  <Button onClick={addCertification} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Certification
                  </Button>
                </div>

                {resumeData.certifications.map((cert, index) => (
                  <Card key={cert.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Certification {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCertification(cert.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Certification Name</Label>
                        <Input
                          value={cert.name}
                          onChange={(e) =>
                            updateCertification(cert.id, "name", e.target.value)
                          }
                          placeholder="e.g., AWS Certified Solutions Architect"
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Issuing Organization</Label>
                          <Input
                            value={cert.issuer}
                            onChange={(e) =>
                              updateCertification(cert.id, "issuer", e.target.value)
                            }
                            placeholder="e.g., Amazon Web Services"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Date Obtained</Label>
                          <Input
                            value={cert.date}
                            onChange={(e) =>
                              updateCertification(cert.id, "date", e.target.value)
                            }
                            placeholder="e.g., Aug 2025"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="lg:sticky lg:top-24 h-fit">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Live Preview</h2>
                  <Badge variant="secondary">{template}</Badge>
                </div>
                <div 
                  className="border border-border rounded-lg overflow-hidden bg-white"
                  data-resume-preview
                >
                  <ResumePreview data={resumeData} template={template} />
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          [data-resume-preview],
          [data-resume-preview] * {
            visibility: visible;
          }
          [data-resume-preview] {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}