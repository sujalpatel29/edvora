import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, FileText, CheckCircle, AlertCircle, Lightbulb, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EssayAssistant = () => {
  const [essay, setEssay] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<{
    grammar: Array<{ text: string; suggestion: string; severity: 'low' | 'medium' | 'high' }>;
    style: Array<{ text: string; suggestion: string; type: 'clarity' | 'flow' | 'vocabulary' }>;
    structure: Array<{ section: string; feedback: string; score: number }>;
    overall: { score: number; summary: string; strengths: string[]; improvements: string[] };
  } | null>(null);
  const { toast } = useToast();

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
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockFeedback = {
        grammar: [
          { text: "sentence structure", suggestion: "Consider breaking this long sentence into two shorter ones for better readability.", severity: 'medium' as const },
          { text: "comma usage", suggestion: "Add a comma before 'and' in this compound sentence.", severity: 'low' as const },
        ],
        style: [
          { text: "word choice", suggestion: "Consider using 'demonstrates' instead of 'shows' for more academic tone.", type: 'vocabulary' as const },
          { text: "transition", suggestion: "Add a transitional phrase to improve flow between paragraphs.", type: 'flow' as const },
        ],
        structure: [
          { section: "Introduction", feedback: "Strong opening with clear thesis statement.", score: 85 },
          { section: "Body Paragraphs", feedback: "Good supporting evidence, but could benefit from stronger topic sentences.", score: 78 },
          { section: "Conclusion", feedback: "Summarizes main points well, consider adding a call to action.", score: 82 },
        ],
        overall: {
          score: 82,
          summary: "Well-structured essay with good arguments. Focus on improving sentence variety and transitions.",
          strengths: ["Clear thesis statement", "Strong evidence", "Logical organization"],
          improvements: ["Sentence variety", "Transitions between ideas", "More sophisticated vocabulary"],
        },
      };
      
      setFeedback(mockFeedback);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete!",
        description: "Your essay has been analyzed. Check the feedback below.",
      });
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'clarity': return <CheckCircle className="h-4 w-4" />;
      case 'flow': return <Zap className="h-4 w-4" />;
      case 'vocabulary': return <Lightbulb className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
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
          <p className="text-muted-foreground">Get intelligent feedback to improve your writing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Essay Input */}
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
                {essay.length} characters, ~{Math.ceil(essay.trim().split(/\s+/).length)} words
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

        {/* Feedback Panel */}
        <div className="space-y-6">
          {feedback ? (
            <>
              {/* Overall Score */}
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
                      <h4 className="font-medium text-success mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        {feedback.overall.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-success" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-warning mb-2">Areas for Improvement</h4>
                      <ul className="space-y-1">
                        {feedback.overall.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                            <AlertCircle className="h-3 w-3 text-warning" />
                            {improvement}
                          </li>
                        ))}
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
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{issue.text}</span>
                        <Badge variant={getSeverityColor(issue.severity)} className="text-xs">
                          {issue.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{issue.suggestion}</p>
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
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(suggestion.type)}
                          <span className="font-medium text-sm">{suggestion.text}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{suggestion.suggestion}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Ready to Analyze</h3>
                <p className="text-muted-foreground">
                  Enter your essay text and click "Analyze Essay" to get detailed AI-powered feedback on grammar, style, and structure.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EssayAssistant;