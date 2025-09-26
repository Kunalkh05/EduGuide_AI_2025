-- Insert sample college resources
INSERT INTO public.college_resources (college_name, resource_type, resource_name, description, contact_info, availability_hours) VALUES
('Delhi University', 'academic_support', 'Academic Writing Center', 'Free tutoring and writing assistance for all students', 'writing@du.ac.in', '9 AM - 5 PM, Mon-Fri'),
('Delhi University', 'mental_health', 'Student Counseling Services', 'Professional counseling and mental health support', 'counseling@du.ac.in', '24/7 Helpline'),
('Delhi University', 'career_services', 'Career Development Center', 'Job placement assistance and career guidance', 'careers@du.ac.in', '10 AM - 4 PM, Mon-Fri'),
('IIT Delhi', 'academic_support', 'Peer Tutoring Program', 'Student-to-student academic support', 'tutoring@iitd.ac.in', '6 PM - 9 PM, Daily'),
('IIT Delhi', 'mental_health', 'Wellness Center', 'Mental health and wellness programs', 'wellness@iitd.ac.in', '9 AM - 6 PM, Mon-Sat'),
('Jawaharlal Nehru University', 'financial_aid', 'Student Financial Aid Office', 'Scholarships and financial assistance programs', 'finaid@jnu.ac.in', '10 AM - 3 PM, Mon-Fri'),
('Jamia Millia Islamia', 'counseling', 'Student Advisory Services', 'Academic and personal counseling', 'advisory@jamia.ac.in', '9 AM - 5 PM, Mon-Fri');

-- Insert sample students data
INSERT INTO public.students (name, email, college_name, course, year_of_study, current_cgpa, attendance_percentage, family_income, extracurricular_activities, previous_backlogs, mental_health_score, study_hours_per_day) VALUES
('Rahul Sharma', 'rahul.sharma@student.du.ac.in', 'Delhi University', 'Computer Science', 2, 7.8, 85.5, 500000, ARRAY['coding club', 'basketball'], 0, 7, 6.5),
('Priya Patel', 'priya.patel@student.iitd.ac.in', 'IIT Delhi', 'Electrical Engineering', 3, 8.2, 92.0, 800000, ARRAY['robotics club', 'debate society'], 1, 8, 8.0),
('Amit Kumar', 'amit.kumar@student.jnu.ac.in', 'Jawaharlal Nehru University', 'Economics', 1, 6.5, 78.0, 300000, ARRAY['drama club'], 2, 5, 4.0),
('Sneha Gupta', 'sneha.gupta@student.jamia.ac.in', 'Jamia Millia Islamia', 'Mass Communication', 4, 9.1, 95.5, 600000, ARRAY['journalism club', 'photography'], 0, 9, 7.5),
('Vikram Singh', 'vikram.singh@student.du.ac.in', 'Delhi University', 'Mathematics', 2, 5.8, 65.0, 250000, ARRAY[], 3, 4, 3.5);

-- Insert sample counselor insights
INSERT INTO public.counselor_insights (student_id, counselor_name, insight_type, observation, recommendation, priority_level, follow_up_required, follow_up_date) VALUES
((SELECT id FROM public.students WHERE email = 'amit.kumar@student.jnu.ac.in'), 'Dr. Meera Joshi', 'academic', 'Student struggling with attendance and has multiple backlogs', 'Recommend intensive tutoring and time management counseling', 'high', true, '2025-01-15'),
((SELECT id FROM public.students WHERE email = 'vikram.singh@student.du.ac.in'), 'Prof. Rajesh Kumar', 'mental_health', 'Shows signs of academic stress and low motivation', 'Refer to counseling services and consider study group participation', 'critical', true, '2025-01-10'),
((SELECT id FROM public.students WHERE email = 'rahul.sharma@student.du.ac.in'), 'Dr. Anita Verma', 'career', 'Strong technical skills, good for software development career', 'Connect with industry mentors and internship opportunities', 'medium', false, NULL),
((SELECT id FROM public.students WHERE email = 'priya.patel@student.iitd.ac.in'), 'Prof. Suresh Nair', 'academic', 'Excellent performance, potential for research opportunities', 'Encourage participation in research projects and conferences', 'low', false, NULL);

-- Insert sample AI predictions
INSERT INTO public.ai_predictions (student_id, dropout_risk_score, risk_level, contributing_factors, recommendations, confidence_score) VALUES
((SELECT id FROM public.students WHERE email = 'amit.kumar@student.jnu.ac.in'), 75.5, 'high', ARRAY['low attendance', 'multiple backlogs', 'low mental health score', 'limited study hours'], ARRAY['Increase study hours', 'Attend counseling sessions', 'Join study groups', 'Improve attendance'], 85.2),
((SELECT id FROM public.students WHERE email = 'vikram.singh@student.du.ac.in'), 82.3, 'critical', ARRAY['very low CGPA', 'poor attendance', 'multiple backlogs', 'low mental health score'], ARRAY['Immediate academic intervention', 'Mental health support', 'Financial counseling', 'Peer mentoring'], 91.7),
((SELECT id FROM public.students WHERE email = 'rahul.sharma@student.du.ac.in'), 25.8, 'low', ARRAY['good CGPA', 'active in extracurriculars'], ARRAY['Continue current study pattern', 'Explore advanced courses'], 78.9),
((SELECT id FROM public.students WHERE email = 'priya.patel@student.iitd.ac.in'), 15.2, 'low', ARRAY['excellent CGPA', 'high attendance', 'good mental health'], ARRAY['Consider research opportunities', 'Leadership roles'], 92.4),
((SELECT id FROM public.students WHERE email = 'sneha.gupta@student.jamia.ac.in'), 18.7, 'low', ARRAY['excellent academic performance', 'high engagement'], ARRAY['Maintain current trajectory', 'Consider advanced projects'], 88.1);
