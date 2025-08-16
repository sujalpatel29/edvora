import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Brain, HelpCircle, RotateCcw, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Flashcard {
  id: number;
  front: string;
  back: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const LearningHub = () => {
  const [searchTopic, setSearchTopic] = useState("");
  const [currentExplanation, setCurrentExplanation] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const { toast } = useToast();

  const generateExplanation = async () => {
    if (!searchTopic.trim()) {
      toast({
        title: "Please enter a topic",
        description: "Type a topic you'd like to learn about.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const mockExplanation = `# ${searchTopic}

## Introduction
${searchTopic} is a fundamental concept that plays a crucial role in computer science and software development. Understanding this topic is essential for building robust and efficient applications.

## Key Concepts

### 1. Basic Principles
The core principles of ${searchTopic} involve understanding how data flows through systems and how different components interact with each other. This forms the foundation for more advanced concepts.

### 2. Practical Applications
In real-world scenarios, ${searchTopic} is used in:
- Software architecture design
- System optimization
- Problem-solving approaches
- Performance improvements

### 3. Best Practices
When working with ${searchTopic}, consider these best practices:
- Start with simple implementations
- Focus on clarity and readability
- Test thoroughly
- Optimize when necessary

## Examples
Here's a simple example to illustrate the concept:

\`\`\`javascript
// Example implementation
function example() {
  console.log("This demonstrates ${searchTopic}");
}
\`\`\`

## Summary
${searchTopic} is an important concept that requires practice and understanding. By following the principles outlined above, you can effectively apply this knowledge in your projects.`;

      setCurrentExplanation(mockExplanation);
      setIsGenerating(false);
      
      toast({
        title: "Explanation generated!",
        description: "Your topic explanation is ready.",
      });
    }, 2000);
  };

  const generateQuiz = () => {
    if (!searchTopic.trim()) {
      toast({
        title: "Please enter a topic",
        description: "Type a topic to generate quiz questions.",
        variant: "destructive",
      });
      return;
    }

    const mockQuestions: Question[] = [
      {
        id: 1,
        question: `What is the primary purpose of ${searchTopic}?`,
        options: [
          "To improve system performance",
          "To enhance code readability",
          "To solve complex problems",
          "All of the above"
        ],
        correct: 3,
        explanation: `${searchTopic} serves multiple purposes including improving performance, enhancing readability, and solving complex problems.`
      },
      {
        id: 2,
        question: `Which of the following is a key principle of ${searchTopic}?`,
        options: [
          "Simplicity",
          "Efficiency",
          "Modularity",
          "All of the above"
        ],
        correct: 3,
        explanation: "All these principles are fundamental to understanding and implementing the concept effectively."
      },
      {
        id: 3,
        question: `When should you apply ${searchTopic} concepts?`,
        options: [
          "Only in large projects",
          "Only when performance is critical",
          "In most software development scenarios",
          "Never"
        ],
        correct: 2,
        explanation: "These concepts are broadly applicable and should be considered in most development scenarios."
      }
    ];

    setCurrentQuiz(mockQuestions);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    
    toast({
      title: "Quiz generated!",
      description: `${mockQuestions.length} questions ready for ${searchTopic}.`,
    });
  };

  const generateFlashcards = () => {
    if (!searchTopic.trim()) {
      toast({
        title: "Please enter a topic",
        description: "Type a topic to generate flashcards.",
        variant: "destructive",
      });
      return;
    }

    const mockCards: Flashcard[] = [
      {
        id: 1,
        front: `What is ${searchTopic}?`,
        back: `${searchTopic} is a fundamental concept in computer science that helps solve complex problems through structured approaches.`,
        difficulty: 'Easy'
      },
      {
        id: 2,
        front: `Key benefits of ${searchTopic}`,
        back: "Improved performance, better code organization, enhanced maintainability, and easier debugging.",
        difficulty: 'Medium'
      },
      {
        id: 3,
        front: `Advanced applications of ${searchTopic}`,
        back: "Used in system architecture, algorithm optimization, design patterns, and large-scale software development.",
        difficulty: 'Hard'
      },
      {
        id: 4,
        front: `Best practices for ${searchTopic}`,
        back: "Start simple, focus on clarity, test thoroughly, document well, and optimize when necessary.",
        difficulty: 'Medium'
      }
    ];

    setFlashcards(mockCards);
    setCurrentCard(0);
    setShowBack(false);
    
    toast({
      title: "Flashcards generated!",
      description: `${mockCards.length} flashcards ready for ${searchTopic}.`,
    });
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    if (answerIndex === currentQuiz[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < currentQuiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  const flipCard = () => {
    setShowBack(!showBack);
  };

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowBack(false);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setShowBack(false);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-gradient-to-r from-success to-primary rounded-lg flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Interactive Learning Hub</h1>
          <p className="text-muted-foreground">Explore topics with AI-powered explanations, quizzes, and flashcards</p>
        </div>
      </div>

      {/* Topic Search */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Input
              placeholder="Enter a topic to learn about (e.g., Data Structures, React Hooks, Machine Learning)"
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              className="flex-1"
            />
            <Button 
              variant="hero"
              onClick={generateExplanation}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Learning...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Learn Topic
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Learning Content */}
      <Tabs defaultValue="explanation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="explanation" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Explanation
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Quiz
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Flashcards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="explanation">
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Topic Explanation
              </CardTitle>
              <CardDescription>
                Comprehensive explanation with examples and best practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentExplanation ? (
                <div className="prose prose-slate max-w-none">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                    {currentExplanation}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ready to Learn</h3>
                  <p className="text-muted-foreground">
                    Enter a topic above and click "Learn Topic" to get an AI-generated explanation.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz">
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-secondary" />
                  Interactive Quiz
                </CardTitle>
                <CardDescription>
                  Test your knowledge with AI-generated questions
                </CardDescription>
              </div>
              {currentQuiz.length === 0 && (
                <Button onClick={generateQuiz} variant="secondary">
                  Generate Quiz
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {currentQuiz.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      Question {currentQuestion + 1} of {currentQuiz.length}
                    </Badge>
                    <Badge variant="secondary">
                      Score: {score}/{currentQuiz.length}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      {currentQuiz[currentQuestion].question}
                    </h3>
                    
                    <div className="grid gap-2">
                      {currentQuiz[currentQuestion].options.map((option, index) => (
                        <Button
                          key={index}
                          variant={
                            showAnswer
                              ? index === currentQuiz[currentQuestion].correct
                                ? "success"
                                : selectedAnswer === index
                                ? "destructive"
                                : "outline"
                              : selectedAnswer === index
                              ? "default"
                              : "outline"
                          }
                          className="justify-start h-auto p-4 text-left"
                          onClick={() => handleAnswerSelect(index)}
                          disabled={showAnswer}
                        >
                          <span className="mr-3">
                            {showAnswer && index === currentQuiz[currentQuestion].correct && <Check className="h-4 w-4" />}
                            {showAnswer && selectedAnswer === index && index !== currentQuiz[currentQuestion].correct && <X className="h-4 w-4" />}
                          </span>
                          {option}
                        </Button>
                      ))}
                    </div>
                    
                    {showAnswer && (
                      <div className="bg-accent/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Explanation:</h4>
                        <p className="text-sm text-muted-foreground">
                          {currentQuiz[currentQuestion].explanation}
                        </p>
                      </div>
                    )}
                    
                    {showAnswer && currentQuestion < currentQuiz.length - 1 && (
                      <Button onClick={nextQuestion} className="w-full">
                        Next Question
                      </Button>
                    )}
                    
                    {showAnswer && currentQuestion === currentQuiz.length - 1 && (
                      <div className="text-center">
                        <h3 className="text-lg font-medium mb-2">Quiz Complete!</h3>
                        <p className="text-muted-foreground">
                          Final Score: {score}/{currentQuiz.length} ({Math.round((score/currentQuiz.length) * 100)}%)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ready to Quiz</h3>
                  <p className="text-muted-foreground">
                    Enter a topic and click "Generate Quiz" to test your knowledge.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flashcards">
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-success" />
                  Study Flashcards
                </CardTitle>
                <CardDescription>
                  Interactive flashcards for spaced repetition learning
                </CardDescription>
              </div>
              {flashcards.length === 0 && (
                <Button onClick={generateFlashcards} variant="success">
                  Generate Flashcards
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {flashcards.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      Card {currentCard + 1} of {flashcards.length}
                    </Badge>
                    <Badge variant={getDifficultyColor(flashcards[currentCard].difficulty)}>
                      {flashcards[currentCard].difficulty}
                    </Badge>
                  </div>
                  
                  <div 
                    className="bg-background border-2 border-dashed border-primary/20 rounded-xl p-8 min-h-[200px] flex items-center justify-center cursor-pointer hover:border-primary/40 transition-colors"
                    onClick={flipCard}
                  >
                    <div className="text-center">
                      <p className="text-lg font-medium mb-4">
                        {showBack ? flashcards[currentCard].back : flashcards[currentCard].front}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click to {showBack ? "show question" : "reveal answer"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      onClick={prevCard} 
                      disabled={currentCard === 0}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button 
                      onClick={flipCard}
                      variant="ghost"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Flip Card
                    </Button>
                    <Button 
                      onClick={nextCard} 
                      disabled={currentCard === flashcards.length - 1}
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <RotateCcw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ready to Study</h3>
                  <p className="text-muted-foreground">
                    Enter a topic and click "Generate Flashcards" to create study cards.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningHub;