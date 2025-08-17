-- Create essays table for storing user essays and analysis
CREATE TABLE public.essays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create study_plans table for storing generated study plans
CREATE TABLE public.study_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  syllabus_content TEXT NOT NULL,
  daily_study_hours INTEGER NOT NULL,
  target_date DATE NOT NULL,
  total_estimated_hours INTEGER,
  days_needed INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create study_topics table for individual topics in study plans
CREATE TABLE public.study_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  study_plan_id UUID NOT NULL REFERENCES public.study_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  estimated_hours INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  completed BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create learning_content table for explanations, quizzes, flashcards
CREATE TABLE public.learning_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('explanation', 'quiz', 'flashcards')),
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.essays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_content ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for essays
CREATE POLICY "Users can view their own essays" ON public.essays FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own essays" ON public.essays FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own essays" ON public.essays FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own essays" ON public.essays FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for study_plans
CREATE POLICY "Users can view their own study plans" ON public.study_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own study plans" ON public.study_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own study plans" ON public.study_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own study plans" ON public.study_plans FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for study_topics
CREATE POLICY "Users can view topics from their study plans" ON public.study_topics FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.study_plans WHERE id = study_plan_id AND user_id = auth.uid()));
CREATE POLICY "Users can create topics for their study plans" ON public.study_topics FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.study_plans WHERE id = study_plan_id AND user_id = auth.uid()));
CREATE POLICY "Users can update topics from their study plans" ON public.study_topics FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.study_plans WHERE id = study_plan_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete topics from their study plans" ON public.study_topics FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.study_plans WHERE id = study_plan_id AND user_id = auth.uid()));

-- Create RLS policies for learning_content
CREATE POLICY "Users can view their own learning content" ON public.learning_content FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own learning content" ON public.learning_content FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own learning content" ON public.learning_content FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own learning content" ON public.learning_content FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_essays_updated_at
  BEFORE UPDATE ON public.essays
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_study_plans_updated_at
  BEFORE UPDATE ON public.study_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();