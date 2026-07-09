import { useState, useEffect, useCallback } from 'react';
import { projectsApi, skillsApi, experienceApi, contactApi, supabase } from '../lib/supabase';
import type { Project, Skill, Experience, ContactMessage } from '../lib/supabase';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getAll();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const channel = supabase
      .channel(`projects-changes-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProjects]);

  const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    const newProject = await projectsApi.create(project);
    setProjects(prev => [...prev, newProject].sort((a, b) => a.display_order - b.display_order));
    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const updated = await projectsApi.update(id, updates);
    setProjects(prev => prev.map(p => p.id === id ? updated : p).sort((a, b) => a.display_order - b.display_order));
    return updated;
  };

  const deleteProject = async (id: string) => {
    await projectsApi.delete(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return { projects, loading, error, refetch: fetchProjects, createProject, updateProject, deleteProject };
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [groupedSkills, setGroupedSkills] = useState<Record<string, Skill[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const data = await skillsApi.getAll();
      setSkills(data);
      const grouped = data.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
      }, {} as Record<string, Skill[]>);
      setGroupedSkills(grouped);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  useEffect(() => {
    const channel = supabase
      .channel(`skills-changes-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'skills' },
        () => {
          fetchSkills();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSkills]);

  const createSkill = async (skill: Omit<Skill, 'id'>) => {
    const newSkill = await skillsApi.create(skill);
    setSkills(prev => [...prev, newSkill].sort((a, b) => a.display_order - b.display_order));
    return newSkill;
  };

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    const updated = await skillsApi.update(id, updates);
    setSkills(prev => prev.map(s => s.id === id ? updated : s).sort((a, b) => a.display_order - b.display_order));
    return updated;
  };

  const deleteSkill = async (id: string) => {
    await skillsApi.delete(id);
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  return { skills, groupedSkills, loading, error, refetch: fetchSkills, createSkill, updateSkill, deleteSkill };
}

export function useExperience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperience = useCallback(async () => {
    try {
      setLoading(true);
      const data = await experienceApi.getAll();
      setExperiences(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load experience');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  const createExperience = async (exp: Omit<Experience, 'id' | 'created_at'>) => {
    const newExp = await experienceApi.create(exp);
    setExperiences(prev => [...prev, newExp].sort((a, b) => a.display_order - b.display_order));
    return newExp;
  };

  const updateExperience = async (id: string, updates: Partial<Experience>) => {
    const updated = await experienceApi.update(id, updates);
    setExperiences(prev => prev.map(e => e.id === id ? updated : e).sort((a, b) => a.display_order - b.display_order));
    return updated;
  };

  const deleteExperience = async (id: string) => {
    await experienceApi.delete(id);
    setExperiences(prev => prev.filter(e => e.id !== id));
  };

  return { experiences, loading, error, refetch: fetchExperience, createExperience, updateExperience, deleteExperience };
}

export function useContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitContact = async (message: Omit<ContactMessage, 'id' | 'read' | 'created_at'>) => {
    try {
      setIsSubmitting(true);
      setError(null);

      await contactApi.submit(message);

      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      if (accessKey) {
        try {
          await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              access_key: accessKey,
              subject: `Portfolio Contact: ${message.subject}`,
              from_name: message.name,
              email: message.email,
              name: message.name,
              message: message.message,
            }),
          });
        } catch (emailErr) {
          console.error('Email notification failed (message was still saved):', emailErr);
        }
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      const msg = err?.message || err?.error_description || err?.details || (err instanceof Error ? err.message : JSON.stringify(err));
      setError(msg || 'Failed to send message');
      console.error('Contact submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSuccess = () => setSubmitSuccess(false);

  return { submitContact, isSubmitting, submitSuccess, error, resetSuccess };
}