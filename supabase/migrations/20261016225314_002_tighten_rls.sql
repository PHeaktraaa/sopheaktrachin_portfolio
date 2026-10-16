/*
# Tighten Row Level Security (RLS) Policies

1. Drops insecure public write policies on `projects`, `skills`, and `experience`.
2. Restricts INSERT, UPDATE, and DELETE on `projects`, `skills`, and `experience` to `authenticated` users only.
3. Preserves public SELECT access for `projects`, `skills`, and `experience`.
4. Restricts `contact_messages` SELECT, UPDATE, and DELETE to `authenticated` users only, while keeping INSERT open to `anon, authenticated` for public form submissions.
5. Configures Storage policies on `project-images` bucket: public read for all visitors, write (INSERT, UPDATE, DELETE) restricted to `authenticated` users only.
*/

-- =====================================================
-- 1. PROJECTS POLICIES
-- =====================================================
DROP POLICY IF EXISTS "public_insert_projects" ON projects;
DROP POLICY IF EXISTS "public_update_projects" ON projects;
DROP POLICY IF EXISTS "public_delete_projects" ON projects;
DROP POLICY IF EXISTS "authenticated_insert_projects" ON projects;
DROP POLICY IF EXISTS "authenticated_update_projects" ON projects;
DROP POLICY IF EXISTS "authenticated_delete_projects" ON projects;

CREATE POLICY "authenticated_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated_update_projects" ON projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_delete_projects" ON projects FOR DELETE
  TO authenticated USING (true);


-- =====================================================
-- 2. SKILLS POLICIES
-- =====================================================
DROP POLICY IF EXISTS "public_insert_skills" ON skills;
DROP POLICY IF EXISTS "public_update_skills" ON skills;
DROP POLICY IF EXISTS "public_delete_skills" ON skills;
DROP POLICY IF EXISTS "authenticated_insert_skills" ON skills;
DROP POLICY IF EXISTS "authenticated_update_skills" ON skills;
DROP POLICY IF EXISTS "authenticated_delete_skills" ON skills;

CREATE POLICY "authenticated_insert_skills" ON skills FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated_update_skills" ON skills FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_delete_skills" ON skills FOR DELETE
  TO authenticated USING (true);


-- =====================================================
-- 3. EXPERIENCE POLICIES
-- =====================================================
DROP POLICY IF EXISTS "public_insert_experience" ON experience;
DROP POLICY IF EXISTS "public_update_experience" ON experience;
DROP POLICY IF EXISTS "public_delete_experience" ON experience;
DROP POLICY IF EXISTS "authenticated_insert_experience" ON experience;
DROP POLICY IF EXISTS "authenticated_update_experience" ON experience;
DROP POLICY IF EXISTS "authenticated_delete_experience" ON experience;

CREATE POLICY "authenticated_insert_experience" ON experience FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated_update_experience" ON experience FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_delete_experience" ON experience FOR DELETE
  TO authenticated USING (true);


-- =====================================================
-- 4. CONTACT MESSAGES POLICIES
-- =====================================================
DROP POLICY IF EXISTS "public_read_contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "authenticated_read_contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "authenticated_update_contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "authenticated_delete_contact_messages" ON contact_messages;

-- Contact messages read/update/delete restricted to authenticated admin only
CREATE POLICY "authenticated_read_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "authenticated_update_contact_messages" ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);


-- =====================================================
-- 5. STORAGE POLICIES (project-images bucket)
-- =====================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "public_read_project_images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_insert_project_images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_update_project_images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_delete_project_images" ON storage.objects;

-- Public can view project images
CREATE POLICY "public_read_project_images" ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'project-images');

-- Only authenticated users can upload project images
CREATE POLICY "authenticated_insert_project_images" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

-- Only authenticated users can update project images
CREATE POLICY "authenticated_update_project_images" ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-images');

-- Only authenticated users can delete project images
CREATE POLICY "authenticated_delete_project_images" ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images');
