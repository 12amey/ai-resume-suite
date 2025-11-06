"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Check, Search, Sparkles, X, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  preview: string;
  rating: number;
  description: string;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const templates: Template[] = [
    {
      id: "1",
      name: "Modern Professional",
      category: "modern",
      thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop",
      preview: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=1000&fit=crop",
      rating: 4.8,
      description: "Clean and professional design perfect for corporate roles and traditional industries.",
    },
    {
      id: "2",
      name: "Creative Designer",
      category: "creative",
      thumbnail: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400&h=500&fit=crop",
      preview: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=800&h=1000&fit=crop",
      rating: 4.9,
      description: "Bold and creative layout ideal for designers, artists, and creative professionals.",
    },
    {
      id: "3",
      name: "Minimal Elegance",
      category: "minimal",
      thumbnail: "https://images.unsplash.com/photo-1586281380614-31b5aa852e58?w=400&h=500&fit=crop",
      preview: "https://images.unsplash.com/photo-1586281380614-31b5aa852e58?w=800&h=1000&fit=crop",
      rating: 4.7,
      description: "Simple yet elegant design that emphasizes your content over decorations.",
    },
    {
      id: "4",
      name: "Executive Suite",
      category: "executive",
      thumbnail: "https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=500&fit=crop",
      preview: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&h=1000&fit=crop",
      rating: 4.9,
      description: "Premium template for senior executives and C-level professionals.",
    },
    {
      id: "5",
      name: "Tech Innovator",
      category: "tech",
      thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=500&fit=crop",
      preview: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=1000&fit=crop",
      rating: 4.6,
      description: "Modern tech-focused design perfect for developers and IT professionals.",
    },
    {
      id: "6",
      name: "Bold Impact",
      category: "creative",
      thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=500&fit=crop",
      preview: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=1000&fit=crop",
      rating: 4.8,
      description: "Make a strong impression with this bold and impactful design.",
    },
    {
      id: "7",
      name: "Classic Professional",
      category: "modern",
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=500&fit=crop",
      preview: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=1000&fit=crop",
      rating: 4.9,
      description: "Timeless classic design that works for any industry and experience level.",
    },
    {
      id: "8",
      name: "Clean Lines",
      category: "minimal",
      thumbnail: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=500&fit=crop",
      preview: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&h=1000&fit=crop",
      rating: 4.7,
      description: "Minimalist design with clean lines and excellent readability.",
    },
    {
      id: "9",
      name: "Corporate Elite",
      category: "executive",
      thumbnail: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop",
      preview: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=1000&fit=crop",
      rating: 4.8,
      description: "Sophisticated design for high-level corporate positions.",
    },
    {
      id: "10",
      name: "Startup Hustler",
      category: "tech",
      thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=500&fit=crop",
      preview: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=1000&fit=crop",
      rating: 4.7,
      description: "Dynamic design perfect for startup culture and entrepreneurial roles.",
    },
    {
      id: "11",
      name: "Academic Scholar",
      category: "executive",
      thumbnail: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=500&fit=crop",
      preview: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=1000&fit=crop",
      rating: 4.6,
      description: "Professional template ideal for academia, research, and education.",
    },
    {
      id: "12",
      name: "Creative Artist",
      category: "creative",
      thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=500&fit=crop",
      preview: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=1000&fit=crop",
      rating: 4.9,
      description: "Showcase your artistic talents with this visually striking template.",
    },
    {
      id: "13",
      name: "Fresh Graduate",
      category: "minimal",
      thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=500&fit=crop",
      preview: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=1000&fit=crop",
      rating: 4.5,
      description: "Perfect for recent graduates and entry-level professionals.",
    },
    {
      id: "14",
      name: "Digital Nomad",
      category: "modern",
      thumbnail: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=500&fit=crop",
      preview: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&h=1000&fit=crop",
      rating: 4.8,
      description: "Modern and flexible design for remote workers and digital nomads.",
    },
    {
      id: "15",
      name: "Business Analyst",
      category: "executive",
      thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=500&fit=crop",
      preview: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=1000&fit=crop",
      rating: 4.7,
      description: "Data-driven design perfect for analysts and business professionals.",
    },
  ];

  const categories = [
    { value: "all", label: "All Templates" },
    { value: "modern", label: "Modern" },
    { value: "creative", label: "Creative" },
    { value: "minimal", label: "Minimal" },
    { value: "executive", label: "Executive" },
    { value: "tech", label: "Tech" },
  ];

  const filteredTemplates = templates
    .filter((template) => {
      const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const handleUseTemplate = (templateId: string) => {
    router.push(`/builder/${templateId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Professional Resume Templates
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Perfect Template
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our collection of professionally designed templates - all free!
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex items-center justify-between mb-8"
          >
            <p className="text-sm text-muted-foreground">
              {filteredTemplates.length} free templates available
            </p>
            <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
              All Free
            </Badge>
          </motion.div>

          {/* Template Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTemplates.map((template, index) => (
              <motion.div key={template.id} variants={itemVariants}>
                <Card className="overflow-hidden border-border/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
                  {/* Thumbnail */}
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-950 dark:to-blue-950 overflow-hidden">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <Button 
                        onClick={() => setPreviewTemplate(template)}
                        className="bg-white text-black hover:bg-white/90 shadow-lg"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        onClick={() => handleUseTemplate(template.id)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Use
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          {template.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="capitalize">{template.category}</span>
                          <span>•</span>
                          <span className="flex items-center text-yellow-600 dark:text-yellow-500">
                            ⭐ {template.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button 
                      onClick={() => handleUseTemplate(template.id)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md hover:shadow-lg shadow-purple-500/20 transition-all"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredTemplates.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <p className="text-lg text-muted-foreground mb-4">
                No templates found matching your criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <div className="relative">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={() => setPreviewTemplate(null)}
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Preview Content */}
            {previewTemplate && (
              <div className="flex flex-col">
                {/* Header */}
                <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                  <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {previewTemplate.name}
                  </h2>
                  <p className="text-muted-foreground mb-3">{previewTemplate.description}</p>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="bg-purple-500/10 text-purple-700 dark:text-purple-400">
                      {previewTemplate.category}
                    </Badge>
                    <span className="flex items-center text-sm text-yellow-600 dark:text-yellow-500">
                      ⭐ {previewTemplate.rating} rating
                    </span>
                    <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                      Free
                    </Badge>
                  </div>
                </div>

                {/* Preview Image */}
                <div className="relative aspect-[8.5/11] bg-gray-100 dark:bg-gray-900 overflow-auto">
                  <img
                    src={previewTemplate.preview}
                    alt={`${previewTemplate.name} preview`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t bg-background flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setPreviewTemplate(null)}
                  >
                    Close Preview
                  </Button>
                  <Button
                    onClick={() => handleUseTemplate(previewTemplate.id)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Use This Template
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}