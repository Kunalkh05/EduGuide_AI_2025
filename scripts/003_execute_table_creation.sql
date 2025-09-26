-- Execute the table creation script
-- This script creates all necessary tables for the educational platform

-- Create students table for storing student information and academic data
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  college_name TEXT NOT NULL,
  course TEXT NOT NULL,
  year_of_study INTEGER NOT NULL CHECK (year_of_study >= 1 AND year_of_study <= 4),
  current_cgpa DECIMAL(3,2) CHECK (current_cgpa >= 0 AND current_cgpa <= 10),
  attendance_percentage DECIMAL(5,2) CHECK (attendance_percentage >= 0 AND attendance_percentage <= 100),
  family_income DECIMAL(10,2),
  extracurricular_activities TEXT[],
  previous_backlogs INTEGER DEFAULT 0,
  mental_health_score INTEGER CHECK (mental_health_score >= 1 AND mental_health_score <= 10),
  study_hours_per_day DECIMAL(4,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create counselor_insights table for storing counselor observations and recommendations
CREATE TABLE IF NOT EXISTS public.counselor_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  counselor_name TEXT NOT NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('academic', 'personal', 'career', 'mental_health')),
  observation TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  priority_level TEXT NOT NULL CHECK (priority_level IN ('low', 'medium', 'high', 'critical')),
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_predictions table for storing dropout risk predictions
CREATE TABLE IF NOT EXISTS public.ai_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  dropout_risk_score DECIMAL(5,2) NOT NULL CHECK (dropout_risk_score >= 0 AND dropout_risk_score <= 100),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  contributing_factors TEXT[] NOT NULL,
  recommendations TEXT[] NOT NULL,
  confidence_score DECIMAL(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
  model_version TEXT NOT NULL DEFAULT 'v1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_sessions table for storing AI chatbot conversations
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  context_type TEXT CHECK (context_type IN ('general', 'academic', 'career', 'mental_health')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create college_resources table for storing institutional resources and support services
CREATE TABLE IF NOT EXISTS public.college_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_name TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('academic_support', 'mental_health', 'career_services', 'financial_aid', 'counseling')),
  resource_name TEXT NOT NULL,
  description TEXT NOT NULL,
  contact_info TEXT,
  availability_hours TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_college ON public.students(college_name);
CREATE INDEX IF NOT EXISTS idx_students_course ON public.students(course);
CREATE INDEX IF NOT EXISTS idx_students_year ON public.students(year_of_study);
CREATE INDEX IF NOT EXISTS idx_counselor_insights_student ON public.counselor_insights(student_id);
CREATE INDEX IF NOT EXISTS idx_counselor_insights_priority ON public.counselor_insights(priority_level);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_student ON public.ai_predictions(student_id);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_risk ON public.ai_predictions(risk_level);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session ON public.chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_college_resources_college ON public.college_resources(college_name);

-- Enable Row Level Security (RLS) for data protection
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselor_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_resources ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no authentication is required)
-- Students table policies
CREATE POLICY "Allow public read access to students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public insert to students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to students" ON public.students FOR UPDATE USING (true);

-- Counselor insights policies
CREATE POLICY "Allow public read access to counselor_insights" ON public.counselor_insights FOR SELECT USING (true);
CREATE POLICY "Allow public insert to counselor_insights" ON public.counselor_insights FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to counselor_insights" ON public.counselor_insights FOR UPDATE USING (true);

-- AI predictions policies
CREATE POLICY "Allow public read access to ai_predictions" ON public.ai_predictions FOR SELECT USING (true);
CREATE POLICY "Allow public insert to ai_predictions" ON public.ai_predictions FOR INSERT WITH CHECK (true);

-- Chat sessions policies
CREATE POLICY "Allow public read access to chat_sessions" ON public.chat_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert to chat_sessions" ON public.chat_sessions FOR INSERT WITH CHECK (true);

-- College resources policies
CREATE POLICY "Allow public read access to college_resources" ON public.college_resources FOR SELECT USING (true);
CREATE POLICY "Allow public insert to college_resources" ON public.college_resources FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to college_resources" ON public.college_resources FOR UPDATE USING (true);
