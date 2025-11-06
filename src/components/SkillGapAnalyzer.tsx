"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, AlertCircle } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SkillGapAnalyzerProps {
  currentSkills: string[];
  requiredSkills: string[];
  recommendedSkills: string[];
  targetRole?: string;
}

export function SkillGapAnalyzer({ 
  currentSkills, 
  requiredSkills, 
  recommendedSkills,
  targetRole = "Software Engineer" 
}: SkillGapAnalyzerProps) {
  
  // Prepare data for radar chart
  const prepareChartData = () => {
    const skillMap = new Map<string, { current: number; required: number }>();
    
    // Add all required skills
    requiredSkills.forEach(skill => {
      skillMap.set(skill, { 
        current: currentSkills.includes(skill) ? 85 : 0, 
        required: 100 
      });
    });
    
    // Add current skills that are not in required
    currentSkills.slice(0, 8).forEach(skill => {
      if (!skillMap.has(skill)) {
        skillMap.set(skill, { current: 85, required: 50 });
      }
    });
    
    // Convert to array for chart
    return Array.from(skillMap.entries()).slice(0, 8).map(([skill, values]) => ({
      skill,
      current: values.current,
      required: values.required
    }));
  };

  const chartData = prepareChartData();
  const missingSkills = requiredSkills.filter(skill => !currentSkills.includes(skill));
  const matchPercentage = Math.round(
    ((requiredSkills.length - missingSkills.length) / requiredSkills.length) * 100
  );

  return (
    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Skill Gap Analysis</h3>
          <p className="text-muted-foreground text-sm">
            Comparing your skills against {targetRole} requirements
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {matchPercentage}%
          </div>
          <p className="text-sm text-muted-foreground">Match Score</p>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="mb-6 h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="skill" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Radar 
              name="Your Skills" 
              dataKey="current" 
              stroke="hsl(var(--chart-1))" 
              fill="hsl(var(--chart-1))" 
              fillOpacity={0.6} 
            />
            <Radar 
              name="Required Skills" 
              dataKey="required" 
              stroke="hsl(var(--chart-2))" 
              fill="hsl(var(--chart-2))" 
              fillOpacity={0.3} 
            />
            <Legend />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Skill Categories */}
      <div className="space-y-4">
        {/* Missing Skills */}
        {missingSkills.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <h4 className="font-semibold text-sm">Missing Skills ({missingSkills.length})</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, index) => (
                <Badge key={index} variant="destructive" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Skills */}
        {recommendedSkills.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <h4 className="font-semibold text-sm">Recommended to Add ({recommendedSkills.length})</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendedSkills.slice(0, 10).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Current Strong Skills */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-500" />
            <h4 className="font-semibold text-sm">Your Strong Skills ({currentSkills.length})</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentSkills.slice(0, 10).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs border-green-500/50 text-green-600 dark:text-green-400">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}