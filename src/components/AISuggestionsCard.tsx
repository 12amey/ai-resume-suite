"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, ChevronUp, Lightbulb, TrendingUp } from "lucide-react";
import { useState } from "react";

interface Suggestion {
  type: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  impact: string;
}

interface AISuggestionsCardProps {
  suggestions: Suggestion[];
  onApplySuggestion?: (suggestion: Suggestion) => void;
}

export function AISuggestionsCard({ suggestions, onApplySuggestion }: AISuggestionsCardProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case "low":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "summary":
        return "📝";
      case "experience":
        return "💼";
      case "skills":
        return "🎯";
      case "formatting":
        return "✨";
      case "keywords":
        return "🔑";
      default:
        return "💡";
    }
  };

  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            AI Suggestions
          </h3>
          <p className="text-muted-foreground text-sm">
            Personalized recommendations to improve your resume
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {suggestions.length} Tips
        </Badge>
      </div>

      <div className="space-y-3">
        {sortedSuggestions.map((suggestion, index) => (
          <div
            key={index}
            className="border border-border/50 rounded-lg p-4 hover:border-purple-500/50 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/10 cursor-pointer"
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="text-2xl mt-0.5">{getTypeIcon(suggestion.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{suggestion.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPriorityColor(suggestion.priority)}`}
                    >
                      {suggestion.priority}
                    </Badge>
                  </div>
                  
                  {expandedIndex === index && (
                    <div className="space-y-3 mt-3 animate-fade-in">
                      <p className="text-sm text-muted-foreground">
                        {suggestion.description}
                      </p>
                      
                      <div className="flex items-start gap-2 p-3 rounded-md bg-purple-500/5 border border-purple-500/20">
                        <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
                            Expected Impact
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {suggestion.impact}
                          </p>
                        </div>
                      </div>

                      {onApplySuggestion && (
                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            onApplySuggestion(suggestion);
                          }}
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Apply Suggestion
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                {expandedIndex === index ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {suggestions.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No suggestions available yet</p>
          <p className="text-sm text-muted-foreground">
            Upload a resume to get AI-powered recommendations
          </p>
        </div>
      )}
    </Card>
  );
}