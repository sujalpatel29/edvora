import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Upload, Clock, Target, BookOpen} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateText } from "../integrations/gemini/generate";

// function parseJsonLines(data: string): {
//   totalHours: string; // keep raw line 1 as string
//   daysNeeded: string; // keep raw line 2 as string
// } {
//   // Split and drop blank lines
//   const lines = stripCodeFences(data)
//     .split(/\r?\n/)
//     .map((l) => l.trim())
//     .filter(Boolean);

//   const totalHoursArr = lines[0] ? parseLine(lines[0]) : [];
//   const daysNeededArr = lines[1] ? parseLine(lines[1]) : [];

//   return {
//     // Keep raw line 1/2 (after cleanup) to parse more flexibly below
//     totalHours: totalHoursArr[0] ?? "",
//     daysNeeded: daysNeededArr[0] ?? "",
//   };
// }

function stripCodeFences(t: string) {
  return t.replace(/^```[\s\S]*?\n?|\n?```$/g, "").trim();
}

function toStringArray(value: unknown): string[] {
  // Normalize any value to string[]
  if (Array.isArray(value)) return value.map((v) => String(v).trim());
  if (value === null || value === undefined) return [];
  return [String(value).trim()];
}

function parseLine(line: string): string[] {
  const clean = stripCodeFences(line).trim();

  // Try JSON first
  try {
    const parsed = JSON.parse(clean);
    return toStringArray(parsed);
  } catch {
    return [clean];
  }
}

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
  const { toast } = useToast();


  const generateSchedule = async () => {
    if (!syllabusText.trim()) {
      toast({
        title: "Please add syllabus content",
        description: "Enter your syllabus text manually.",
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

    try {
          // 🔑 CHANGE 3: Modified prompt to include enhanced version
          const today: Date = new Date();
          const year = today.getFullYear();
          const month = today.getMonth() + 1; // Add 1 because months are 0-indexed
          const day = today.getDate();

          console.log(`Today's date: ${year}-${month}-${day}`);

          const analysisRaw =
            await generateText(`You are an AI Schedule generator for given syllabus. Analyze the following details(Syllabus of Subject, Study hours per day and taget date at which study should be completed) and provide feedback as a JSON response. Do not format your response as code or use code blocks. Return only the raw JSON text without any markdown formatting or additional explanation.
    
          Syllabus: "${syllabusText}"

          stydy Hours: ${studyHours}

          today date: ${year}-${month}-${day}  (YYYY-MM-DD)
          Target date: ${targetDate} (YYYY-MM-DD)
          
          Provide your analysis in this exact JSON structure:
          
          {
            "totalHours": <total number of hours required>,
            "daysNeeded": "<number of days required>",
            "studyTopics": [
              { "name": "<nameOfChapter>", "difficulty": "Easy|Medium|Hard", "priority": "Low|Medium|High", "estimatedHours": <estimated study Hours required for given chapter}
            ]
          }
          
          Note:
          -If given time duration is too much then you can suggest "totalHours" and "daysNeeded" according to study hours needed for given chapters.
          -Goal is to get isights about every chapter but not very deep that it takes too much time to study.
          -Give "totalHours" and "daysNeeded" as time remaining to target date based on study hours per day.
          -example of StydyTopics and style:
          "studyTopics": [
            { "chapterName": "Programming Fundamentals", "difficulty": "Easy", "priority": "High" },
            { "chapterName": "Data Structures", "difficulty": "Medium", "priority": "Medium" },
          ],
          
          `);
    console.log("Gemini Response :", analysisRaw);

      let parsed;
      try {
        parsed = JSON.parse(stripCodeFences(analysisRaw));
      } catch (e) {
        console.error("Parse error", e, analysisRaw);
        toast({
          title: "AI response invalid",
          description: "Could not parse AI response.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }



    // Simulate AI processing
    
      const finalSchedule: StudySchedule = {
        topics: parsed.studyTopics || [],
        totalHours: parsed.totalHours,
        daysNeeded: parsed.daysNeeded,
        startDate: new Date().toISOString().split('T')[0],
        endDate: targetDate,
      };

      setSchedule(finalSchedule);
      setIsGenerating(false);

      toast({
        title: "Schedule generated successfully!",
        description: "Your personalized study plan is ready.",
      });
    
    } catch (err) {
      toast({
        title: "Error analyzing essay",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
                Enter Syllabus
              </CardTitle>
              <CardDescription>
                Enter your syllabus content manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  Enter your syllabus and set your preferences to generate a personalized study schedule.
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