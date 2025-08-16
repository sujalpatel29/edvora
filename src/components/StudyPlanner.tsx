import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Upload, Clock, Target, BookOpen, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudyTopic {
  name: string;
  estimatedHours: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
}

interface StudySchedule {
  topics: StudyTopic[];
  totalHours: number;
  daysNeeded: number;
  startDate: string;
  endDate: string;
}

const StudyPlanner = () => {
  const [syllabusText, setSyllabusText] = useState("");
  const [studyHours, setStudyHours] = useState("2");
  const [targetDate, setTargetDate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [schedule, setSchedule] = useState<StudySchedule | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      // Simulate PDF text extraction
      toast({
        title: "PDF uploaded successfully",
        description: "Extracting text from your syllabus...",
      });
      
      setTimeout(() => {
        setSyllabusText("Introduction to Computer Science\n\n1. Programming Fundamentals\n   - Variables and Data Types\n   - Control Structures\n   - Functions and Methods\n\n2. Data Structures\n   - Arrays and Lists\n   - Stacks and Queues\n   - Trees and Graphs\n\n3. Algorithms\n   - Sorting Algorithms\n   - Search Algorithms\n   - Algorithm Complexity\n\n4. Object-Oriented Programming\n   - Classes and Objects\n   - Inheritance\n   - Polymorphism\n\n5. Web Development\n   - HTML/CSS\n   - JavaScript\n   - Frameworks");
        
        toast({
          title: "Text extracted successfully",
          description: "Your syllabus content is ready for schedule generation.",
        });
      }, 1500);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
    }
  };

  const generateSchedule = async () => {
    if (!syllabusText.trim()) {
      toast({
        title: "Please add syllabus content",
        description: "Upload a PDF or enter your syllabus text manually.",
        variant: "destructive",
      });
      return;
    }

    if (!targetDate) {
      toast({
        title: "Please set a target date",
        description: "Select when you want to complete your studies.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI processing
    setTimeout(() => {
      const mockSchedule: StudySchedule = {
        topics: [
          { name: "Programming Fundamentals", estimatedHours: 15, difficulty: "Easy", priority: "High", completed: false },
          { name: "Data Structures", estimatedHours: 20, difficulty: "Medium", priority: "High", completed: false },
          { name: "Algorithms", estimatedHours: 18, difficulty: "Hard", priority: "High", completed: false },
          { name: "Object-Oriented Programming", estimatedHours: 12, difficulty: "Medium", priority: "Medium", completed: false },
          { name: "Web Development", estimatedHours: 10, difficulty: "Easy", priority: "Low", completed: false },
        ],
        totalHours: 75,
        daysNeeded: Math.ceil(75 / parseInt(studyHours)),
        startDate: new Date().toISOString().split('T')[0],
        endDate: targetDate,
      };

      setSchedule(mockSchedule);
      setIsGenerating(false);

      toast({
        title: "Schedule generated successfully!",
        description: "Your personalized study plan is ready.",
      });
    }, 3000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
          <Calendar className="h-5 w-5 text-secondary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Smart Study Planner</h1>
          <p className="text-muted-foreground">Generate personalized study schedules from your syllabus</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload Syllabus
              </CardTitle>
              <CardDescription>
                Upload a PDF or enter your syllabus content manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf"
                  className="hidden"
                />
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  Drop your syllabus PDF here or click to browse
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose PDF File
                </Button>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                or
              </div>
              
              <Textarea
                placeholder="Enter your syllabus content here..."
                value={syllabusText}
                onChange={(e) => setSyllabusText(e.target.value)}
                className="min-h-[200px]"
              />
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-secondary" />
                Study Preferences
              </CardTitle>
              <CardDescription>
                Set your study schedule parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studyHours">Daily Study Hours</Label>
                  <Input
                    id="studyHours"
                    type="number"
                    min="1"
                    max="12"
                    value={studyHours}
                    onChange={(e) => setStudyHours(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetDate">Target Completion</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <Button
                onClick={generateSchedule}
                disabled={isGenerating || !syllabusText.trim()}
                variant="hero"
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Schedule...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Generate Study Schedule
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Display */}
        <div className="space-y-6">
          {schedule ? (
            <>
              {/* Schedule Overview */}
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-success" />
                    Schedule Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-primary/5 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{schedule.totalHours}h</p>
                      <p className="text-sm text-muted-foreground">Total Study Time</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/5 rounded-lg">
                      <p className="text-2xl font-bold text-secondary">{schedule.daysNeeded}</p>
                      <p className="text-sm text-muted-foreground">Days Needed</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>0% Complete</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Topics List */}
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Study Topics
                  </CardTitle>
                  <CardDescription>
                    Your personalized learning roadmap
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {schedule.topics.map((topic, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{topic.name}</h4>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={getDifficultyColor(topic.difficulty)} className="text-xs">
                              {topic.difficulty}
                            </Badge>
                            <Badge variant={getPriorityColor(topic.priority)} className="text-xs">
                              {topic.priority} Priority
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-primary">{topic.estimatedHours}h</p>
                          <p className="text-xs text-muted-foreground">estimated</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Progress value={topic.completed ? 100 : 0} className="flex-1 mr-3 h-2" />
                        <Button
                          variant={topic.completed ? "success" : "outline"}
                          size="sm"
                          disabled={topic.completed}
                        >
                          {topic.completed ? "Completed" : "Start"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Ready to Plan</h3>
                <p className="text-muted-foreground">
                  Upload your syllabus and set your preferences to generate a personalized study schedule.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;