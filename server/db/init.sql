-- Insert initial data
INSERT INTO organizations (name, type, description, website_url)
VALUES 
  ('Wellness Center', 'Private Practice', 'Leading mental health practice dedicated to providing high-quality supervision and training opportunities.', 'https://wellnesscenter.com'),
  ('Community Health', 'Community Mental Health', 'Comprehensive mental health services for the community with excellent training programs.', 'https://communityhealth.org'),
  ('City Hospital', 'Hospital', 'Major medical center with extensive mental health and supervision programs.', 'https://cityhospital.org');

INSERT INTO supervisors (name, organization_id, specialties, experience, bio)
VALUES 
  ('Dr. Jane Smith', 1, ARRAY['Clinical Psychology', 'CBT'], 10, 'Experienced supervisor specializing in evidence-based therapeutic approaches.'),
  ('Dr. John Doe', 1, ARRAY['Counseling', 'Trauma-Informed Care'], 8, 'Dedicated to supporting the growth of new therapists through collaborative supervision.'),
  ('Dr. Sarah Johnson', 2, ARRAY['Social Work', 'Family Therapy'], 12, 'Passionate about community mental health and culturally-informed practice.');

-- Add some initial reviews
INSERT INTO supervisor_reviews (supervisor_id, rating, content, author, supervision_period, is_anonymous, helpful_count)
VALUES 
  (1, 5, 'Excellent supervisor who provides thoughtful feedback and creates a supportive learning environment.', 'Anonymous Intern', '1 year', true, 12),
  (1, 4, 'Very knowledgeable and helpful in developing clinical skills.', 'Jane Doe', '6 months', false, 8),
  (2, 5, 'Great mentor who really cares about supervisee development.', 'Anonymous', '1 year', true, 15);

INSERT INTO organization_reviews (organization_id, rating, content, author, role, employment_period, is_anonymous)
VALUES 
  (1, 5, 'Excellent training environment with supportive staff.', 'Anonymous', 'Intern', '1 year', true),
  (1, 4, 'Great learning opportunities and supervision.', 'John Smith', 'Associate', '2 years', false),
  (2, 5, 'Wonderful community-focused organization with strong supervision.', 'Anonymous', 'Intern', '1 year', true);