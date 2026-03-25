-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  problem_statement TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Phase Enums
CREATE TYPE phase_enum AS ENUM (
  'functional_decomposition',
  'morphological_chart',
  'risk_analysis'
);

CREATE TYPE phase_status_enum AS ENUM (
  'pending',
  'validation_failed',
  'human_review',
  'completed'
);

-- Phases Table
CREATE TABLE project_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  phase_name phase_enum NOT NULL,
  ai_generated_data JSONB,
  human_approved_data JSONB,
  status phase_status_enum DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(project_id, phase_name)
);

-- Basic Row Level Security (RLS) setup
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;
