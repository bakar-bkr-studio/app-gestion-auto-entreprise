/*
  # URGENT: User Data Separation Security Fix
  
  This migration implements immediate user data isolation to prevent
  unauthorized access between different user accounts.
  
  1. Database Schema Updates
    - Add user_id columns to all user data tables
    - Create indexes for performance
    - Enable Row Level Security (RLS)
    - Implement strict data isolation policies
  
  2. Security Measures
    - Complete data separation between users
    - Prevent cross-user data access
    - Ensure data integrity and privacy
*/

-- Add user_id columns with proper foreign key constraints
ALTER TABLE clients ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE todos ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);

-- Enable Row Level Security on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to ensure clean state
DROP POLICY IF EXISTS "Users can view their own clients" ON clients;
DROP POLICY IF EXISTS "Users can insert their own clients" ON clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON clients;

DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

DROP POLICY IF EXISTS "Users can view their own todos" ON todos;
DROP POLICY IF EXISTS "Users can insert their own todos" ON todos;
DROP POLICY IF EXISTS "Users can update their own todos" ON todos;
DROP POLICY IF EXISTS "Users can delete their own todos" ON todos;

-- Create strict RLS policies for clients table
CREATE POLICY "Users can view their own clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients"
  ON clients
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create strict RLS policies for projects table
CREATE POLICY "Users can view their own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create strict RLS policies for todos table
CREATE POLICY "Users can view their own todos"
  ON todos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos"
  ON todos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos"
  ON todos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos"
  ON todos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- CRITICAL: Assign existing data to the original user (bakar77100@gmail.com)
-- This ensures data integrity and proper ownership
DO $$
DECLARE
    gmail_user_id uuid;
BEGIN
    -- Find the user ID for bakar77100@gmail.com
    SELECT id INTO gmail_user_id 
    FROM auth.users 
    WHERE email = 'bakar77100@gmail.com' 
    LIMIT 1;
    
    -- If the user exists, assign all existing data to them
    IF gmail_user_id IS NOT NULL THEN
        -- Update clients table
        UPDATE clients 
        SET user_id = gmail_user_id 
        WHERE user_id IS NULL;
        
        -- Update projects table
        UPDATE projects 
        SET user_id = gmail_user_id 
        WHERE user_id IS NULL;
        
        -- Update todos table
        UPDATE todos 
        SET user_id = gmail_user_id 
        WHERE user_id IS NULL;
        
        RAISE NOTICE 'Data ownership assigned to user: %', gmail_user_id;
    ELSE
        RAISE NOTICE 'User bakar77100@gmail.com not found - no data assignment performed';
    END IF;
END $$;