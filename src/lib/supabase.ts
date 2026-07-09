import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image_url: string | null;
  image_urls: string[];
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string | null;
  display_order: number;
}

export interface Experience {
  id: string;
  type: 'education' | 'work';
  title: string;
  organization: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  display_order: number;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

// API Functions
export const projectsApi = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getFeatured(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

export const skillsApi = {
  async getAll(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getByCategory(): Promise<Record<string, Skill[]>> {
    const skills = await this.getAll();
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
  },

  async create(skill: Omit<Skill, 'id'>): Promise<Skill> {
    const { data, error } = await supabase
      .from('skills')
      .insert(skill)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Skill>): Promise<Skill> {
    const { data, error } = await supabase
      .from('skills')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

export const experienceApi = {
  async getAll(): Promise<Experience[]> {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getByType(type: 'education' | 'work'): Promise<Experience[]> {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('type', type)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(experience: Omit<Experience, 'id' | 'created_at'>): Promise<Experience> {
    const { data, error } = await supabase
      .from('experience')
      .insert(experience)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Experience>): Promise<Experience> {
    const { data, error } = await supabase
      .from('experience')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('experience')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

export const contactApi = {
  async submit(message: Omit<ContactMessage, 'id' | 'read' | 'created_at'>): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(message)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAll(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .update({ read: true })
      .eq('id', id);
    if (error) throw error;
  },
};