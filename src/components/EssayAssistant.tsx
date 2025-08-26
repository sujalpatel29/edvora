import { useState } from "react";
import { generateText } from "../integrations/gemini/generate";
//added for essay assistant
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  FileText,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Zap,
  Copy,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

//function for parsing JSON lines
function parseJsonLines(data: string): {
  strengths: string[];
  improvements: string[];
  scoreLine: string; // keep raw line 1 as string
  suggestionLine: string; // keep raw line 2 as string
} {
  // Split and drop blank lines
  const lines = stripCodeFences(data)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const scoreArr = lines[0] ? parseLine(lines[0]) : [];
  const suggestionArr = lines[1] ? parseLine(lines[1]) : [];
  const strengths = lines[2] ? parseLine(lines[2]) : [];
  const improvements = lines[3] ? parseLine(lines[3]) : [];

  return {
    // Keep raw line 1/2 (after cleanup) to parse more flexibly below
    scoreLine: scoreArr[0] ?? "",
    suggestionLine: suggestionArr[0] ?? "",
    strengths,
    improvements,
  };
}

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
    // Not valid JSON – try to extract numbers or return whole line
    return [clean];
  }
}

const EssayAssistant = () => {
  const [essay, setEssay] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<{
    grammar: Array<{
      text: string;
      suggestion: string;
      severity: "low" | "medium" | "high";
    }>;
    style: Array<{
      text: string;
      suggestion: string;
      type: "clarity" | "flow" | "vocabulary";
    }>;
    structure: Array<{ section: string; feedback: string; score: number }>;
    overall: {
      score: number;
      summary: string;
      strengths: string[];
      improvements: string[];
    };
    enhancedVersion: string; // 🔑 CHANGE 1: Added enhanced version to feedback state
  } | null>(null);
  const { toast } = useToast();

  // 🔑 CHANGE 2: Added function to copy enhanced version to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Enhanced version copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try selecting and copying manually.",
        variant: "destructive",
      });
    }
  };

  const analyzessay = async () => {
    if (!essay.trim()) {
      toast({
        title: "Please enter some text",
        description: "Write or paste your essay to get AI-powered feedback.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // 🔑 CHANGE 3: Modified prompt to include enhanced version
      const analysisRaw =
        await generateText(`You are an AI Essay Assistant. Analyze the following essay and provide feedback as a JSON response. Do not format your response as code or use code blocks. Return only the raw JSON text without any markdown formatting or additional explanation.

      Essay: ${essay}

      Provide your analysis in this exact JSON structure:

      {
        "score": <number 0-100>,
        "summary": "<1–2 sentence summary>",
        "strengths": ["point1", "point2", "point3"],
        "improvements": ["point1", "point2", "point3"],
        "grammar": [
          { "text": "<issue>", "severity": "low|medium|high", "suggestion": "<correction>" }
        ],
        "style": [
          { "text": "<issue>", "type": "clarity|flow|vocabulary", "suggestion": "<recommendation>" }
        ],
        "enhancedVersion": "<improved version of the essay with better grammar, style, structure, and flow while maintaining the original meaning and voice>"
      }

      Note:
      -give strength and improvements in few words.
      -example of grammar and style:
      "grammar": [
        { "text": "sentence structure", "severity": "medium", "suggestion": "Split long sentences into shorter ones." },
        { "text": "comma usage", "severity": "low", "suggestion": "Add a comma before 'and' in compound sentences." }
      ],
      "style": [
        { "text": "word choice", "type": "vocabulary", "suggestion": "Use 'demonstrates' instead of 'shows'." },
        { "text": "transition", "type": "flow", "suggestion": "Add transitional phrases for smoother flow." }
      ]

      For the enhancedVersion:
      - Keep the original meaning and voice of the essay
      - Fix grammar and punctuation errors
      - Improve sentence structure and flow
      - Use more sophisticated vocabulary where appropriate
      - Ensure logical organization and smooth transitions
      - Maintain the same length approximately

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
        setIsAnalyzing(false);
        return;
      }

      // 🔑 CHANGE 4: Added enhanced version to final feedback
      const finalFeedback = {
        grammar: parsed.grammar || [],
        style: parsed.style || [],
        structure: [], // keep for future expansion if you want
        overall: {
          score: parsed.score,
          summary: parsed.summary,
          strengths: parsed.strengths || [],
          improvements: parsed.improvements || [],
        },
        enhancedVersion: parsed.enhancedVersion || "", // Added enhanced version
      };

      setFeedback(finalFeedback);

      toast({
        title: "Analysis Complete!",
        description: "Your essay has been analyzed. Check the feedback below.",
      });
    } catch (err) {
      toast({
        title: "Error analyzing essay",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "success";
      case "medium":
        return "warning";
      case "low":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "clarity":
        return <CheckCircle className="h-4 w-4" />;
      case "flow":
        return <Zap className="h-4 w-4" />;
      case "vocabulary":
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Essay Assistant</h1>
          <p className="text-muted-foreground">
            Get intelligent feedback to improve your writing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Your Essay */}
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Your Essay
              </CardTitle>
              <CardDescription>
                Write or paste your essay below for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Start writing your essay here..."
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                className="min-h-[400px] resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {essay.length} characters, ~
                  {Math.ceil(essay.trim().split(/\s+/).length)} words
                </p>
                <Button
                  onClick={analyzessay}
                  disabled={isAnalyzing || !essay.trim()}
                  variant="hero"
                  className="min-w-[140px]"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze Essay
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Version - Below Your Essay */}
          {feedback && feedback.enhancedVersion && (
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Enhanced Version
                </CardTitle>
                <CardDescription>
                  AI-improved version of your essay
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={feedback.enhancedVersion}
                  readOnly
                  className="min-h-[400px] resize-none bg-muted/50"
                />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {feedback.enhancedVersion.length} characters, ~
                    {Math.ceil(
                      feedback.enhancedVersion.trim().split(/\s+/).length
                    )}{" "}
                    words
                  </p>
                  <Button
                    onClick={() => copyToClipboard(feedback.enhancedVersion)}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Feedback Panel */}
        {feedback ? (
          <>
            {/* Overall Score */}
            {/* Overall Score */}
            <div className="space-y-6">
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Overall Score</span>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {feedback.overall.score}/100
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {feedback.overall.summary}
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-success mb-2">
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {feedback.overall.strengths.map((strength, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <CheckCircle className="h-3 w-3 text-success" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-warning mb-2">
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-1">
                        {feedback.overall.improvements.map(
                          (improvement, index) => (
                            <li
                              key={index}
                              className="text-sm text-muted-foreground flex items-center gap-2"
                            >
                              <AlertCircle className="h-3 w-3 text-warning" />
                              {improvement}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Grammar Issues */}
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Grammar & Mechanics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {feedback.grammar.map((issue, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {issue.text}
                        </span>
                        <Badge
                          variant={getSeverityColor(issue.severity)}
                          className="text-xs"
                        >
                          {issue.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {issue.suggestion}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Style Suggestions */}
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Style & Clarity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {feedback.style.map((suggestion, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(suggestion.type)}
                          <span className="font-medium text-sm">
                            {suggestion.text}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.suggestion}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-8 text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Ready to Analyze</h3>
              <p className="text-muted-foreground">
                Enter your essay text and click "Analyze Essay" to get detailed
                AI-powered feedback on grammar, style, and structure.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EssayAssistant;
