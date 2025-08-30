import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Brain, Calendar, TrendingUp, Target, Clock } from "lucide-react";
import heroImage from "@/assets/hero-education.jpg";

interface DashboardProps {
  onSectionChange: (section: string) => void;
}

const Dashboard = ({ onSectionChange }: DashboardProps) => {
  const features = [
    {
      id: "essay",
      title: "Content Analyzer",
      description: "Get intelligent feedback on grammar, style, and structure",
      icon: Brain,
      color: "text-primary",
      progress: 0,
    },
    {
      id: "schedule",
      title: "Smart Study Planner",
      description: "Generate personalized schedules from your syllabus",
      icon: Calendar,
      color: "text-secondary",
      progress: 0,
    },
    {
      id: "topics",
      title: "Interactive Learning Hub",
      description: "Explore topics with explanations, quizzes, and flashcards",
      icon: BookOpen,
      color: "text-success",
      progress: 0,
    },
  ];

  return (
    <div className="space-y-8">
     <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 lg:p-12 shadow-glow">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Welcome to Your AI Study Companion
          </h1>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Transform your learning experience with intelligent Content Analyzer, personalized study schedules, and interactive topic exploration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => onSectionChange("essay")}
              className="animate-pulse-glow"
            >
              <Brain className="mr-2 h-5 w-5" />
              Start Writing Assistant
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => onSectionChange("schedule")}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Plan Your Studies
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
          <img 
            src={heroImage} 
            alt="Students learning" 
            className="w-full h-full object-cover rounded-r-2xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={feature.id} 
              className="bg-gradient-card border-0 shadow-card hover:shadow-elegant transition-spring hover:-translate-y-1 cursor-pointer group"
              onClick={() => onSectionChange(feature.id)}
            >
              <CardHeader className="pb-4">
                <div className={`h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:animate-pulse-glow transition-smooth`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-smooth"
                  >
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;