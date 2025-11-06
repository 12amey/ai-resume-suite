"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  FileText, 
  Upload,
  Brain,
  Award,
  Zap,
  ChevronRight,
  BarChart3
} from "lucide-react";
import Link from "next/link";

export default function CareerIntelligenceHub() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState("Full Stack Developer");

  useEffect(() => {
    const token = localStorage.getItem("bearer_token");
    if (!token) {
      router.push("/login?redirect=/career-hub");
      return;
    }

    // Fetch user data
    fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch user skills
    fetch("/api/skills", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.skills) {
          setSkills(data.skills);
        }
      })
      .catch(err => console.error("Failed to load skills:", err));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Resume Analysis",
      description: "Get instant AI-powered insights on your resume quality and improvements",
      action: "Analyze Resume",
      href: "#analyze"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Skill Gap Detection",
      description: "Identify missing skills for your dream job with visual radar charts",
      action: "Check Skills",
      href: "#skills"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "ATS Score Checker",
      description: "See how well your resume performs against Applicant Tracking Systems",
      action: "Check ATS Score",
      href: "#ats"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Career Progress",
      description: "Track your skill growth, projects, and learning journey over time",
      action: "View Progress",
      href: "#progress"
    }
  ];

  // Role-based skill requirements
  const roleRequirements: Record<string, { skill: string; required: number }[]> = {
    "Full Stack Developer": [
      { skill: "JavaScript", required: 90 },
      { skill: "React", required: 85 },
      { skill: "Node.js", required: 80 },
      { skill: "Database", required: 75 },
      { skill: "TypeScript", required: 85 },
      { skill: "API Design", required: 80 },
      { skill: "Git", required: 70 },
      { skill: "Testing", required: 65 }
    ],
    "Frontend Developer": [
      { skill: "HTML/CSS", required: 95 },
      { skill: "JavaScript", required: 90 },
      { skill: "React", required: 90 },
      { skill: "TypeScript", required: 80 },
      { skill: "UI/UX", required: 75 },
      { skill: "Responsive Design", required: 85 },
      { skill: "Performance", required: 70 },
      { skill: "Accessibility", required: 65 }
    ],
    "Backend Developer": [
      { skill: "Node.js", required: 90 },
      { skill: "Database", required: 90 },
      { skill: "API Design", required: 85 },
      { skill: "Security", required: 80 },
      { skill: "Microservices", required: 75 },
      { skill: "Docker", required: 70 },
      { skill: "Cloud", required: 75 },
      { skill: "Testing", required: 70 }
    ]
  };

  const calculateSkillMatch = () => {
    const requirements = roleRequirements[selectedRole];
    if (!requirements) return { match: 0, missing: [], total: 0 };

    let totalMatch = 0;
    let totalRequired = 0;
    const missing: string[] = [];

    requirements.forEach(req => {
      totalRequired += req.required;
      const userSkill = skills.find(s => 
        s.name.toLowerCase().includes(req.skill.toLowerCase()) ||
        req.skill.toLowerCase().includes(s.name.toLowerCase())
      );

      if (userSkill) {
        // User has this skill, add to match score
        totalMatch += Math.min(req.required, 100);
      } else {
        // User is missing this skill
        missing.push(req.skill);
      }
    });

    const matchPercentage = totalRequired > 0 ? Math.round((totalMatch / totalRequired) * 100) : 0;

    return { match: matchPercentage, missing, total: requirements.length };
  };

  const skillMatch = calculateSkillMatch();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium animate-fade-in">
              <Brain className="w-4 h-4" />
              AI-Powered Career Intelligence
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in-up">
              Your Personal
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Career Intelligence Hub
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animation-delay-100">
              Analyze your resume, detect skill gaps, get AI-powered suggestions, 
              and track your career progress—all in one intelligent dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Skill Match</p>
                  <p className="text-3xl font-bold text-purple-600">{skillMatch.match}%</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600/50" />
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Skills Added</p>
                  <p className="text-3xl font-bold text-blue-600">{skills.length}</p>
                </div>
                <Award className="w-8 h-8 text-blue-600/50" />
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Missing Skills</p>
                  <p className="text-3xl font-bold text-cyan-600">{skillMatch.missing.length}</p>
                </div>
                <Target className="w-8 h-8 text-cyan-600/50" />
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Target Role</p>
                  <p className="text-base font-bold text-green-600">{selectedRole.split(" ")[0]}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600/50" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-8 border-border/50 bg-card/50 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    {feature.icon}
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-purple-600 hover:text-purple-700 hover:bg-purple-500/10"
                  asChild
                >
                  <Link href={feature.href}>
                    <Zap className="w-4 h-4 mr-2" />
                    {feature.action}
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skill Gap Analyzer - NOW FUNCTIONAL */}
      <section id="skills" className="relative py-12 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <Card className="p-8 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
            <div className="text-center mb-8">
              <Target className="w-12 h-12 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
              <h2 className="text-3xl font-bold mb-2">Skill Gap Analyzer</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See how your current skills match your target role requirements
              </p>
            </div>

            {/* Role Selector */}
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
              {Object.keys(roleRequirements).map((role) => (
                <Button
                  key={role}
                  variant={selectedRole === role ? "default" : "outline"}
                  onClick={() => setSelectedRole(role)}
                  className={selectedRole === role ? "bg-gradient-to-r from-purple-600 to-blue-600" : ""}
                >
                  {role}
                </Button>
              ))}
            </div>

            {/* Skill Match Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 bg-white/50 dark:bg-gray-900/50">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Overall Match</p>
                  <div className="relative w-32 h-32 mx-auto mb-2">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - skillMatch.match / 100)}`}
                        className="text-purple-600 transition-all duration-1000"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-purple-600">{skillMatch.match}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Skills matching {selectedRole}</p>
                </div>
              </Card>

              <Card className="p-6 bg-white/50 dark:bg-gray-900/50">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Your Skills</p>
                  <p className="text-5xl font-bold text-blue-600 mb-2">{skills.length}</p>
                  <p className="text-xs text-muted-foreground">Total skills in profile</p>
                  <Button 
                    variant="link" 
                    className="mt-2 text-blue-600"
                    asChild
                  >
                    <Link href="/dashboard">Add More Skills</Link>
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-white/50 dark:bg-gray-900/50">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Missing Skills</p>
                  <p className="text-5xl font-bold text-orange-600 mb-2">{skillMatch.missing.length}</p>
                  <p className="text-xs text-muted-foreground">Skills to learn</p>
                  {skillMatch.missing.length > 0 && (
                    <Button 
                      variant="link" 
                      className="mt-2 text-orange-600"
                      onClick={() => {
                        const element = document.getElementById("missing-skills");
                        element?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      View Details
                    </Button>
                  )}
                </div>
              </Card>
            </div>

            {/* Missing Skills List */}
            {skillMatch.missing.length > 0 && (
              <div id="missing-skills" className="mt-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  Skills to Learn for {selectedRole}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {skillMatch.missing.map((skill, idx) => (
                    <Card key={idx} className="p-4 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/30">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-orange-900 dark:text-orange-100">{skill}</span>
                        <Sparkles className="w-4 h-4 text-orange-600" />
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button 
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    asChild
                  >
                    <Link href="/dashboard">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Add These Skills to Profile
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {skillMatch.match === 100 && (
              <div className="mt-8 p-6 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-lg text-center">
                <Award className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
                  Perfect Match! 🎉
                </h3>
                <p className="text-green-800 dark:text-green-200">
                  You have all the required skills for {selectedRole}. Keep building your experience!
                </p>
              </div>
            )}
          </Card>
        </div>
      </section>

      {/* Upload Resume Section */}
      <section id="analyze" className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 text-center bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-purple-500/20">
            <Upload className="w-16 h-16 mx-auto mb-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-3xl font-bold mb-4">
              Start Your Career Analysis
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upload your resume or select an existing one to get instant AI-powered insights, 
              skill gap analysis, and personalized improvement suggestions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Resume
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                asChild
              >
                <Link href="/dashboard">
                  <FileText className="w-5 h-5 mr-2" />
                  Select from Dashboard
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* ATS Score Section Placeholder */}
      <section id="ats" className="relative py-12 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <Card className="p-8 border-dashed border-2 border-blue-500/30 bg-blue-500/5">
            <div className="text-center space-y-4">
              <Award className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400" />
              <h3 className="text-2xl font-bold">ATS Score Checker</h3>
              <p className="text-muted-foreground">
                Comprehensive analysis of how your resume performs with ATS systems
              </p>
              <Button asChild>
                <Link href="/ats-check">Go to ATS Checker</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Career Progress Placeholder */}
      <section id="progress" className="relative py-12 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <Card className="p-8 border-dashed border-2 border-cyan-500/30 bg-cyan-500/5">
            <div className="text-center space-y-4">
              <BarChart3 className="w-12 h-12 mx-auto text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-2xl font-bold">Career Progress Tracker</h3>
              <p className="text-muted-foreground">
                Track your skill growth, projects, and learning journey over time
              </p>
              <p className="text-sm text-cyan-600">Coming soon...</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}