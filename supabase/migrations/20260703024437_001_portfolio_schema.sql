/*
# Portfolio Website Database Schema

Creates the core tables for a personal portfolio website:
1. `projects` - Stores portfolio projects with full CRUD capability
2. `skills` - Technical skills organized by category
3. `experience` - Education and work history
4. `contact_messages` - Contact form submissions

## Tables Created

### projects
- `id` (uuid, primary key)
- `title` (text, project name)
- `description` (text, detailed description)
- `technologies` (text[], array of tech used)
- `image_url` (text, project screenshot/demo image)
- `live_url` (text, deployed project URL)
- `github_url` (text, GitHub repository URL)
- `featured` (boolean, highlights on homepage)
- `display_order` (integer, custom sorting)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### skills
- `id` (uuid, primary key)
- `name` (text, skill name)
- `category` (text, e.g., "Frontend", "Backend", "Database")
- `proficiency` (integer, 1-100 level)
- `icon` (text, icon identifier)
- `display_order` (integer, custom sorting)

### experience
- `id` (uuid, primary key)
- `type` (text, "education" or "work")
- `title` (text, degree or job title)
- `organization` (text, school or company)
- `description` (text, details)
- `start_date` (date)
- `end_date` (date, null if current)
- `display_order` (integer)
- `created_at` (timestamp)

### contact_messages
- `id` (uuid, primary key)
- `name` (text, sender name)
- `email` (text, sender email)
- `subject` (text, message subject)
- `message` (text, message content)
- `read` (boolean, tracking read status)
- `created_at` (timestamp)

## Security
- RLS enabled on all tables
- Public read access for portfolio display
- Public write for contact_messages (form submissions)
- Full CRUD operations available for content management
*/

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  technologies text[] NOT NULL DEFAULT '{}',
  image_url text,
  live_url text,
  github_url text,
  featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  proficiency integer NOT NULL DEFAULT 80 CHECK (proficiency >= 0 AND proficiency <= 100),
  icon text,
  display_order integer NOT NULL DEFAULT 0
);

-- Experience table (education and work)
CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('education', 'work')),
  title text NOT NULL,
  organization text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Projects policies (public read, full CRUD for management)
DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_projects" ON projects;
CREATE POLICY "public_insert_projects" ON projects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_projects" ON projects;
CREATE POLICY "public_update_projects" ON projects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_projects" ON projects;
CREATE POLICY "public_delete_projects" ON projects FOR DELETE
  TO anon, authenticated USING (true);

-- Skills policies (public read, full CRUD for management)
DROP POLICY IF EXISTS "public_read_skills" ON skills;
CREATE POLICY "public_read_skills" ON skills FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_skills" ON skills;
CREATE POLICY "public_insert_skills" ON skills FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_skills" ON skills;
CREATE POLICY "public_update_skills" ON skills FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_skills" ON skills;
CREATE POLICY "public_delete_skills" ON skills FOR DELETE
  TO anon, authenticated USING (true);

-- Experience policies (public read, full CRUD for management)
DROP POLICY IF EXISTS "public_read_experience" ON experience;
CREATE POLICY "public_read_experience" ON experience FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_experience" ON experience;
CREATE POLICY "public_insert_experience" ON experience FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_experience" ON experience;
CREATE POLICY "public_update_experience" ON experience FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_experience" ON experience;
CREATE POLICY "public_delete_experience" ON experience FOR DELETE
  TO anon, authenticated USING (true);

-- Contact messages policies (public insert for form submissions, public read)
DROP POLICY IF EXISTS "public_read_contact_messages" ON contact_messages;
CREATE POLICY "public_read_contact_messages" ON contact_messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_experience_type ON experience(type);

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();