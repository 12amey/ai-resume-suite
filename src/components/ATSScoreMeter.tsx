"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Award } from "lucide-react";
import { useEffect, useState } from "react";

interface ATSScoreMeterProps {
  score: number;
  feedback?: {
    passed: string[];
    warnings: string[];
    failed: string[];
  };
}

export function ATSScoreMeter({ score, feedback }: ATSScoreMeterProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Animate score counting up
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">ATS Score</h3>
          <p className="text-muted-foreground text-sm">
            Applicant Tracking System compatibility analysis
          </p>
        </div>
        <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>

      {/* Circular Progress */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-48 h-48">
          <svg className="transform -rotate-90 w-48 h-48">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r="90"
              stroke="hsl(var(--border))"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="96"
              cy="96"
              r="90"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" />
                <stop offset="100%" stopColor="hsl(var(--chart-2))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-5xl font-bold ${getScoreColor(displayScore)}`}>
              {displayScore}
            </div>
            <div className="text-lg text-muted-foreground">/ 100</div>
            <div className={`text-sm font-semibold mt-1 ${getScoreColor(displayScore)}`}>
              {getScoreLabel(displayScore)}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Details */}
      {feedback && (
        <div className="space-y-4">
          {/* Passed Checks */}
          {feedback.passed.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <h4 className="font-semibold text-sm">Passed ({feedback.passed.length})</h4>
              </div>
              <div className="space-y-1">
                {feedback.passed.map((item, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {feedback.warnings.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <h4 className="font-semibold text-sm">Warnings ({feedback.warnings.length})</h4>
              </div>
              <div className="space-y-1">
                {feedback.warnings.map((item, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Failed Checks */}
          {feedback.failed.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <h4 className="font-semibold text-sm">Issues to Fix ({feedback.failed.length})</h4>
              </div>
              <div className="space-y-1">
                {feedback.failed.map((item, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Score Breakdown */}
      <div className="mt-6 pt-6 border-t border-border/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {feedback?.passed.length || 0}
            </div>
            <div className="text-xs text-muted-foreground">Passed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {feedback?.warnings.length || 0}
            </div>
            <div className="text-xs text-muted-foreground">Warnings</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {feedback?.failed.length || 0}
            </div>
            <div className="text-xs text-muted-foreground">Issues</div>
          </div>
        </div>
      </div>
    </Card>
  );
}