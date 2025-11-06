"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Briefcase,
  Trophy,
  BookOpen,
  Code,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Award,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

// Hardcoded userId for demo (in production, get from auth)
const DEMO_USER_ID = 1;

interface Internship {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string | null;
  skillsUsed: string | null;
  location: string | null;
}

interface Hackathon {
  id: number;
  name: string;
  organizer: string | null;
  date: string;
  position: string | null;
  projectName: string | null;
  description: string | null;
  technologies: string | null;
  teamSize: number | null;
}

interface Course {
  id: number;
  name: string;
  platform: string | null;
  instructor: string | null;
  completionDate: string | null;
  certificateUrl: string | null;
  skillsLearned: string | null;
  duration: string | null;
}

interface Project {
  id: number;
  name: string;
  description: string | null;
  link: string | null;
  githubUrl: string | null;
  technologies: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
}

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState("internships");
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [internships, setInternships] = useState<Internship[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Dialog states
  const [showInternshipDialog, setShowInternshipDialog] = useState(false);
  const [showHackathonDialog, setShowHackathonDialog] = useState(false);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);

  // Edit mode states
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);
  const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form data states
  const [internshipForm, setInternshipForm] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    skillsUsed: "",
    location: "",
  });

  const [hackathonForm, setHackathonForm] = useState({
    name: "",
    organizer: "",
    date: "",
    position: "",
    projectName: "",
    description: "",
    technologies: "",
    teamSize: "",
  });

  const [courseForm, setCourseForm] = useState({
    name: "",
    platform: "",
    instructor: "",
    completionDate: "",
    certificateUrl: "",
    skillsLearned: "",
    duration: "",
  });

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    link: "",
    githubUrl: "",
    technologies: "",
    startDate: "",
    endDate: "",
    status: "in-progress",
  });

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [internshipsRes, hackathonsRes, coursesRes, projectsRes] = await Promise.all([
        fetch(`/api/internships?userId=${DEMO_USER_ID}`),
        fetch(`/api/hackathons?userId=${DEMO_USER_ID}`),
        fetch(`/api/courses?userId=${DEMO_USER_ID}`),
        fetch(`/api/projects?userId=${DEMO_USER_ID}`),
      ]);

      if (internshipsRes.ok) setInternships(await internshipsRes.json());
      if (hackathonsRes.ok) setHackathons(await hackathonsRes.json());
      if (coursesRes.ok) setCourses(await coursesRes.json());
      if (projectsRes.ok) setProjects(await projectsRes.json());
    } catch (error) {
      toast.error("Failed to fetch achievements");
    } finally {
      setLoading(false);
    }
  };

  // Internship CRUD
  const handleSaveInternship = async () => {
    try {
      const data = {
        userId: DEMO_USER_ID,
        ...internshipForm,
        current: internshipForm.current,
      };

      const url = editingInternship
        ? `/api/internships?id=${editingInternship.id}`
        : "/api/internships";
      const method = editingInternship ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save internship");

      toast.success(editingInternship ? "Internship updated!" : "Internship added!");
      setShowInternshipDialog(false);
      resetInternshipForm();
      fetchAllData();
    } catch (error) {
      toast.error("Failed to save internship");
    }
  };

  const handleDeleteInternship = async (id: number) => {
    if (!confirm("Delete this internship?")) return;
    try {
      const res = await fetch(`/api/internships?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Internship deleted");
      fetchAllData();
    } catch (error) {
      toast.error("Failed to delete internship");
    }
  };

  const resetInternshipForm = () => {
    setInternshipForm({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      skillsUsed: "",
      location: "",
    });
    setEditingInternship(null);
  };

  // Hackathon CRUD
  const handleSaveHackathon = async () => {
    try {
      const data = {
        userId: DEMO_USER_ID,
        ...hackathonForm,
        teamSize: hackathonForm.teamSize ? parseInt(hackathonForm.teamSize) : null,
      };

      const url = editingHackathon
        ? `/api/hackathons?id=${editingHackathon.id}`
        : "/api/hackathons";
      const method = editingHackathon ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save hackathon");

      toast.success(editingHackathon ? "Hackathon updated!" : "Hackathon added!");
      setShowHackathonDialog(false);
      resetHackathonForm();
      fetchAllData();
    } catch (error) {
      toast.error("Failed to save hackathon");
    }
  };

  const handleDeleteHackathon = async (id: number) => {
    if (!confirm("Delete this hackathon?")) return;
    try {
      const res = await fetch(`/api/hackathons?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Hackathon deleted");
      fetchAllData();
    } catch (error) {
      toast.error("Failed to delete hackathon");
    }
  };

  const resetHackathonForm = () => {
    setHackathonForm({
      name: "",
      organizer: "",
      date: "",
      position: "",
      projectName: "",
      description: "",
      technologies: "",
      teamSize: "",
    });
    setEditingHackathon(null);
  };

  // Course CRUD
  const handleSaveCourse = async () => {
    try {
      const data = {
        userId: DEMO_USER_ID,
        ...courseForm,
      };

      const url = editingCourse ? `/api/courses?id=${editingCourse.id}` : "/api/courses";
      const method = editingCourse ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save course");

      toast.success(editingCourse ? "Course updated!" : "Course added!");
      setShowCourseDialog(false);
      resetCourseForm();
      fetchAllData();
    } catch (error) {
      toast.error("Failed to save course");
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    try {
      const res = await fetch(`/api/courses?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Course deleted");
      fetchAllData();
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const resetCourseForm = () => {
    setCourseForm({
      name: "",
      platform: "",
      instructor: "",
      completionDate: "",
      certificateUrl: "",
      skillsLearned: "",
      duration: "",
    });
    setEditingCourse(null);
  };

  // Project CRUD
  const handleSaveProject = async () => {
    try {
      const data = {
        userId: DEMO_USER_ID,
        ...projectForm,
      };

      const url = editingProject ? `/api/projects?id=${editingProject.id}` : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save project");

      toast.success(editingProject ? "Project updated!" : "Project added!");
      setShowProjectDialog(false);
      resetProjectForm();
      fetchAllData();
    } catch (error) {
      toast.error("Failed to save project");
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Project deleted");
      fetchAllData();
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      name: "",
      description: "",
      link: "",
      githubUrl: "",
      technologies: "",
      startDate: "",
      endDate: "",
      status: "in-progress",
    });
    setEditingProject(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Achievements</h1>
            <p className="text-muted-foreground">
              Track your internships, hackathons, courses, and projects
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 border-border/50 bg-gradient-to-br from-blue-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{internships.length}</p>
                  <p className="text-sm text-muted-foreground">Internships</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border/50 bg-gradient-to-br from-purple-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{hackathons.length}</p>
                  <p className="text-sm text-muted-foreground">Hackathons</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border/50 bg-gradient-to-br from-green-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{courses.length}</p>
                  <p className="text-sm text-muted-foreground">Courses</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border/50 bg-gradient-to-br from-orange-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Code className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{projects.length}</p>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="internships">
                <Briefcase className="w-4 h-4 mr-2" />
                Internships
              </TabsTrigger>
              <TabsTrigger value="hackathons">
                <Trophy className="w-4 h-4 mr-2" />
                Hackathons
              </TabsTrigger>
              <TabsTrigger value="courses">
                <BookOpen className="w-4 h-4 mr-2" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="projects">
                <Code className="w-4 h-4 mr-2" />
                Projects
              </TabsTrigger>
            </TabsList>

            {/* Internships Tab */}
            <TabsContent value="internships" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Internships</h2>
                <Button
                  onClick={() => {
                    resetInternshipForm();
                    setShowInternshipDialog(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Internship
                </Button>
              </div>

              <div className="grid gap-4">
                {internships.map((internship) => (
                  <Card key={internship.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{internship.position}</h3>
                        <p className="text-purple-600 dark:text-purple-400 font-medium">
                          {internship.company}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {internship.startDate} - {internship.current ? "Present" : internship.endDate}
                          </span>
                          {internship.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {internship.location}
                            </span>
                          )}
                        </div>
                        {internship.description && (
                          <p className="mt-3 text-sm">{internship.description}</p>
                        )}
                        {internship.skillsUsed && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {internship.skillsUsed.split(",").map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingInternship(internship);
                            setInternshipForm({
                              company: internship.company,
                              position: internship.position,
                              startDate: internship.startDate,
                              endDate: internship.endDate || "",
                              current: internship.current,
                              description: internship.description || "",
                              skillsUsed: internship.skillsUsed || "",
                              location: internship.location || "",
                            });
                            setShowInternshipDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteInternship(internship.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Hackathons Tab */}
            <TabsContent value="hackathons" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Hackathons</h2>
                <Button
                  onClick={() => {
                    resetHackathonForm();
                    setShowHackathonDialog(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Hackathon
                </Button>
              </div>

              <div className="grid gap-4">
                {hackathons.map((hackathon) => (
                  <Card key={hackathon.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{hackathon.name}</h3>
                        {hackathon.organizer && (
                          <p className="text-purple-600 dark:text-purple-400 font-medium">
                            {hackathon.organizer}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {hackathon.date}
                          </span>
                          {hackathon.position && (
                            <span className="flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              {hackathon.position}
                            </span>
                          )}
                          {hackathon.teamSize && (
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              Team of {hackathon.teamSize}
                            </span>
                          )}
                        </div>
                        {hackathon.projectName && (
                          <p className="mt-2 font-medium text-sm">Project: {hackathon.projectName}</p>
                        )}
                        {hackathon.description && (
                          <p className="mt-2 text-sm">{hackathon.description}</p>
                        )}
                        {hackathon.technologies && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {hackathon.technologies.split(",").map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingHackathon(hackathon);
                            setHackathonForm({
                              name: hackathon.name,
                              organizer: hackathon.organizer || "",
                              date: hackathon.date,
                              position: hackathon.position || "",
                              projectName: hackathon.projectName || "",
                              description: hackathon.description || "",
                              technologies: hackathon.technologies || "",
                              teamSize: hackathon.teamSize?.toString() || "",
                            });
                            setShowHackathonDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteHackathon(hackathon.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Courses</h2>
                <Button
                  onClick={() => {
                    resetCourseForm();
                    setShowCourseDialog(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              </div>

              <div className="grid gap-4">
                {courses.map((course) => (
                  <Card key={course.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{course.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
                          {course.platform && (
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              {course.platform}
                            </span>
                          )}
                          {course.instructor && <span>• {course.instructor}</span>}
                        </div>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          {course.completionDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Completed: {course.completionDate}
                            </span>
                          )}
                          {course.duration && (
                            <span className="flex items-center gap-1">
                              <GraduationCap className="w-4 h-4" />
                              {course.duration}
                            </span>
                          )}
                        </div>
                        {course.skillsLearned && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {course.skillsLearned.split(",").map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        {course.certificateUrl && (
                          <a
                            href={course.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-3 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                          >
                            View Certificate →
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCourse(course);
                            setCourseForm({
                              name: course.name,
                              platform: course.platform || "",
                              instructor: course.instructor || "",
                              completionDate: course.completionDate || "",
                              certificateUrl: course.certificateUrl || "",
                              skillsLearned: course.skillsLearned || "",
                              duration: course.duration || "",
                            });
                            setShowCourseDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Projects</h2>
                <Button
                  onClick={() => {
                    resetProjectForm();
                    setShowProjectDialog(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </div>

              <div className="grid gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{project.name}</h3>
                          {project.status && (
                            <span
                              className={`px-2 py-0.5 text-xs rounded ${
                                project.status === "completed"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                  : project.status === "in-progress"
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                  : "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {project.status.replace("-", " ")}
                            </span>
                          )}
                        </div>
                        {project.description && (
                          <p className="mt-2 text-sm">{project.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          {project.startDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {project.startDate} - {project.endDate || "Present"}
                            </span>
                          )}
                        </div>
                        {project.technologies && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {project.technologies.split(",").map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-4 mt-3">
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                            >
                              View Project →
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                            >
                              GitHub →
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingProject(project);
                            setProjectForm({
                              name: project.name,
                              description: project.description || "",
                              link: project.link || "",
                              githubUrl: project.githubUrl || "",
                              technologies: project.technologies || "",
                              startDate: project.startDate || "",
                              endDate: project.endDate || "",
                              status: project.status || "in-progress",
                            });
                            setShowProjectDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Internship Dialog */}
      <Dialog open={showInternshipDialog} onOpenChange={setShowInternshipDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingInternship ? "Edit Internship" : "Add Internship"}
            </DialogTitle>
            <DialogDescription>
              Add details about your internship experience
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Company *</Label>
                <Input
                  value={internshipForm.company}
                  onChange={(e) =>
                    setInternshipForm({ ...internshipForm, company: e.target.value })
                  }
                  placeholder="Google"
                />
              </div>
              <div>
                <Label>Position *</Label>
                <Input
                  value={internshipForm.position}
                  onChange={(e) =>
                    setInternshipForm({ ...internshipForm, position: e.target.value })
                  }
                  placeholder="Software Engineer Intern"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date *</Label>
                <Input
                  type="month"
                  value={internshipForm.startDate}
                  onChange={(e) =>
                    setInternshipForm({ ...internshipForm, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={internshipForm.endDate}
                  onChange={(e) =>
                    setInternshipForm({ ...internshipForm, endDate: e.target.value })
                  }
                  disabled={internshipForm.current}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="current"
                checked={internshipForm.current}
                onChange={(e) =>
                  setInternshipForm({ ...internshipForm, current: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="current" className="cursor-pointer">
                Currently working here
              </Label>
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={internshipForm.location}
                onChange={(e) =>
                  setInternshipForm({ ...internshipForm, location: e.target.value })
                }
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={internshipForm.description}
                onChange={(e) =>
                  setInternshipForm({ ...internshipForm, description: e.target.value })
                }
                rows={4}
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
            <div>
              <Label>Skills Used (comma-separated)</Label>
              <Input
                value={internshipForm.skillsUsed}
                onChange={(e) =>
                  setInternshipForm({ ...internshipForm, skillsUsed: e.target.value })
                }
                placeholder="React, Node.js, Python"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInternshipDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveInternship}>
              {editingInternship ? "Update" : "Add"} Internship
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hackathon Dialog */}
      <Dialog open={showHackathonDialog} onOpenChange={setShowHackathonDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingHackathon ? "Edit Hackathon" : "Add Hackathon"}
            </DialogTitle>
            <DialogDescription>
              Add details about your hackathon participation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hackathon Name *</Label>
                <Input
                  value={hackathonForm.name}
                  onChange={(e) =>
                    setHackathonForm({ ...hackathonForm, name: e.target.value })
                  }
                  placeholder="HackMIT 2024"
                />
              </div>
              <div>
                <Label>Organizer</Label>
                <Input
                  value={hackathonForm.organizer}
                  onChange={(e) =>
                    setHackathonForm({ ...hackathonForm, organizer: e.target.value })
                  }
                  placeholder="MIT"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={hackathonForm.date}
                  onChange={(e) =>
                    setHackathonForm({ ...hackathonForm, date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Team Size</Label>
                <Input
                  type="number"
                  value={hackathonForm.teamSize}
                  onChange={(e) =>
                    setHackathonForm({ ...hackathonForm, teamSize: e.target.value })
                  }
                  placeholder="4"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Achievement/Position</Label>
                <Input
                  value={hackathonForm.position}
                  onChange={(e) =>
                    setHackathonForm({ ...hackathonForm, position: e.target.value })
                  }
                  placeholder="1st Place"
                />
              </div>
              <div>
                <Label>Project Name</Label>
                <Input
                  value={hackathonForm.projectName}
                  onChange={(e) =>
                    setHackathonForm({ ...hackathonForm, projectName: e.target.value })
                  }
                  placeholder="SmartScheduler"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={hackathonForm.description}
                onChange={(e) =>
                  setHackathonForm({ ...hackathonForm, description: e.target.value })
                }
                rows={4}
                placeholder="Describe your project and achievements..."
              />
            </div>
            <div>
              <Label>Technologies (comma-separated)</Label>
              <Input
                value={hackathonForm.technologies}
                onChange={(e) =>
                  setHackathonForm({ ...hackathonForm, technologies: e.target.value })
                }
                placeholder="React, Python, OpenAI API"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHackathonDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveHackathon}>
              {editingHackathon ? "Update" : "Add"} Hackathon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course Dialog */}
      <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Edit Course" : "Add Course"}</DialogTitle>
            <DialogDescription>
              Add details about your completed course
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Course Name *</Label>
              <Input
                value={courseForm.name}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, name: e.target.value })
                }
                placeholder="Advanced React Patterns"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Platform</Label>
                <Input
                  value={courseForm.platform}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, platform: e.target.value })
                  }
                  placeholder="Udemy, Coursera, etc."
                />
              </div>
              <div>
                <Label>Instructor</Label>
                <Input
                  value={courseForm.instructor}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, instructor: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Completion Date</Label>
                <Input
                  type="date"
                  value={courseForm.completionDate}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, completionDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Duration</Label>
                <Input
                  value={courseForm.duration}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, duration: e.target.value })
                  }
                  placeholder="20 hours"
                />
              </div>
            </div>
            <div>
              <Label>Certificate URL</Label>
              <Input
                value={courseForm.certificateUrl}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, certificateUrl: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Skills Learned (comma-separated)</Label>
              <Input
                value={courseForm.skillsLearned}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, skillsLearned: e.target.value })
                }
                placeholder="React, Hooks, Context API"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCourseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCourse}>
              {editingCourse ? "Update" : "Add"} Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Dialog */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Add Project"}</DialogTitle>
            <DialogDescription>Add details about your project</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Project Name *</Label>
              <Input
                value={projectForm.name}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, name: e.target.value })
                }
                placeholder="My Awesome Project"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={projectForm.description}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, description: e.target.value })
                }
                rows={4}
                placeholder="Describe your project..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Project Link</Label>
                <Input
                  value={projectForm.link}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, link: e.target.value })
                  }
                  placeholder="https://project.com"
                />
              </div>
              <div>
                <Label>GitHub URL</Label>
                <Input
                  value={projectForm.githubUrl}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, githubUrl: e.target.value })
                  }
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
            <div>
              <Label>Technologies (comma-separated)</Label>
              <Input
                value={projectForm.technologies}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, technologies: e.target.value })
                }
                placeholder="React, Node.js, MongoDB"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={projectForm.startDate}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={projectForm.endDate}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, endDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <select
                value={projectForm.status}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProjectDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProject}>
              {editingProject ? "Update" : "Add"} Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}