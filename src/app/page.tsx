"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Zap, Target, FileText, CheckCircle, Globe, TrendingUp, Award } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      // Redirect to login if not authenticated
      router.push("/login");
    }
  }, [router]);

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Writing",
      description: "Generate professional resume content with advanced AI assistance"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "ATS Score Checker",
      description: "Optimize your resume for applicant tracking systems"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Multiple Templates",
      description: "Choose from modern, creative, and professional designs"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Job Matcher",
      description: "Match your resume to specific job descriptions"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Preview",
      description: "See changes instantly as you build your resume"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multi-language Support",
      description: "Create resumes in multiple languages and tones"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium animate-fade-in">
              <Sparkles className="w-4 h-4" />
              AI-Powered Resume Builder
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in-up">
              Build Your Dream Resume
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                With AI Assistance
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animation-delay-100">
              Create professional, ATS-friendly resumes in minutes. Get AI-powered suggestions, 
              match your resume to jobs, and land more interviews.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-200">
              <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg">
                <Link href="/dashboard">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Building Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8 py-6 text-lg">
                <Link href="#features">
                  View Features
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground animate-fade-in-up animation-delay-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Free templates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Everything You Need to
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Stand Out</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you create the perfect resume
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 text-center bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-purple-500/20">
            <TrendingUp className="w-12 h-12 mx-auto mb-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of job seekers who have successfully created professional resumes with ResumeAI
            </p>
            <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg">
              <Link href="/dashboard">
                <Award className="w-5 h-5 mr-2" />
                Get Started Now
              </Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-border/40">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">ResumeAI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}