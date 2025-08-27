import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Brain, Calendar, TrendingUp, Target, Clock } from "lucide-react";
import heroImage from "@/assets/hero-education.jpg";

interface DashboardProps {
  onSectionChange: (section: string) => void;
}

const Dashboard = ({ onSectionChange }: DashboardProps) => {
  const features = [
    {
      id: "essay",
      title: "AI Essay Assistant",
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

  const stats = [
    { label: "Essays Reviewed", value: "0", icon: Brain },
    { label: "Study Hours Planned", value: "0", icon: Clock },
    { label: "Topics Mastered", value: "0", icon: Target },
    { label: "Learning Streak", value: "0 days", icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 lg:p-12 shadow-glow">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Welcome to Your AI Study Companion
          </h1>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Transform your learning experience with intelligent essay feedback, personalized study schedules, and interactive topic exploration.
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-gradient-card border-0 shadow-card hover:shadow-elegant transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Cards */}
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
                  {/* <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{feature.progress}%</span>
                  </div>
                  <Progress value={feature.progress} className="h-2" /> */}
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

      {/* Quick Actions */}
      {/* <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Jump into your most common tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2"
              onClick={() => onSectionChange("essay")}
            >
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-sm">Review Essay</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2"
              onClick={() => onSectionChange("schedule")}
            >
              <Calendar className="h-6 w-6 text-secondary" />
              <span className="text-sm">Create Schedule</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2"
              onClick={() => onSectionChange("topics")}
            >
              <BookOpen className="h-6 w-6 text-success" />
              <span className="text-sm">Study Topics</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2"
              onClick={() => onSectionChange("topics")}
            >
              <Target className="h-6 w-6 text-warning" />
              <span className="text-sm">Take Quiz</span>
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default Dashboard;