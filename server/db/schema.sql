/* server/db/schema.sql */

-- Create tables
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  description TEXT,
  website_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE supervisors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  organization_id INTEGER REFERENCES organizations(id),
  specialties TEXT[] NOT NULL,
  experience INTEGER NOT NULL,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE supervisor_reviews (
  id SERIAL PRIMARY KEY,
  supervisor_id INTEGER REFERENCES supervisors(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  supervision_period VARCHAR(100) NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE organization_reviews (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  employment_period VARCHAR(100) NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_supervisor_organization ON supervisors(organization_id);
CREATE INDEX idx_supervisor_reviews_supervisor ON supervisor_reviews(supervisor_id);
CREATE INDEX idx_organization_reviews_organization ON organization_reviews(organization_id);