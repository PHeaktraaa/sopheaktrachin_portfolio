import { useState, useEffect, useRef } from 'react';
import { useProjects } from '../../hooks/useData';
import { useAdmin } from '../../contexts/AdminContext';
import { supabase } from '../../lib/supabase';
import {
  ExternalLink,
  Github,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Folder,
  Star,
  Upload,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Project } from '../../lib/supabase';

const MAX_IMAGES = 20;

function ProjectCard({ project, onEdit, onDelete, onOpenLightbox, isAdmin }: { project: Project; onEdit: (project: Project) => void; onDelete: (id: string) => void; onOpenLightbox: (project: Project, startIndex: number) => void; isAdmin: boolean }) {
  const images = project.image_urls && project.image_urls.length > 0
    ? project.image_urls
    : [project.image_url || 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800'];
  const [index, setIndex] = useState(0);

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };
  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="group card-hover overflow-hidden">
      <div
        className="relative aspect-video overflow-hidden cursor-pointer"
        onClick={() => onOpenLightbox(project, index)}
      >
        <img
          src={images[index]}
          alt={`${project.title} - image ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {project.featured && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-accent-500/90 backdrop-blur-sm rounded-full text-sm font-medium text-slate-950">
            <Star className="w-4 h-4" />
            Featured
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-900/70 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-900/70 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-white w-4' : 'bg-white/50'}`}
                />
              ))}
            </div>
            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-900/70 backdrop-blur-sm text-xs text-white">
              {index + 1}/{images.length}
            </div>
          </>
        )}

        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-3 bg-primary-500 rounded-xl text-white hover:bg-primary-400 transition-colors shadow-lg"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-3 bg-slate-800 rounded-xl text-white hover:bg-slate-700 transition-colors shadow-lg"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>

        {isAdmin && (
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="p-2 bg-slate-900/80 backdrop-blur-sm rounded-lg text-slate-300 hover:text-primary-400 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              className="p-2 bg-slate-900/80 backdrop-blur-sm rounded-lg text-slate-300 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-100 mb-2 group-hover:text-primary-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs font-medium bg-slate-800/80 text-slate-300 rounded-full border border-slate-700"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-3 py-1 text-xs font-medium bg-slate-800/80 text-slate-500 rounded-full border border-slate-700">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectLightbox({ project, startIndex, onClose }: { project: Project; startIndex: number; onClose: () => void }) {
  const images = project.image_urls && project.image_urls.length > 0
    ? project.image_urls
    : [project.image_url || 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800'];
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const goPrev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    const threshold = 50;
    if (touchDeltaX.current > threshold) {
      goPrev();
    } else if (touchDeltaX.current < -threshold) {
      goNext();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm z-[100] flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 rounded-full bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-slate-200 z-10">
        <p className="font-semibold">{project.title}</p>
        {images.length > 1 && (
          <p className="text-sm text-slate-400">{index + 1} / {images.length}</p>
        )}
      </div>

      <div
        className="relative w-full h-full flex items-center justify-center px-4 sm:px-20 py-20"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[index]}
          alt={`${project.title} - image ${index + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg select-none"
          draggable={false}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-slate-800/80 rounded-full text-white hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-slate-800/80 rounded-full text-white hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-2"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((url, i) => (
            <button
              key={url}
              onClick={() => setIndex(i)}
              className={`w-12 h-12 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                i === index ? 'border-primary-400 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectForm({ project, onSave, onCancel }: { project?: Project | null; onSave: (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    technologies: project?.technologies.join(', ') || '',
    image_url: project?.image_url || '',
    image_urls: project?.image_urls || [],
    live_url: project?.live_url || '',
    github_url: project?.github_url || '',
    featured: project?.featured || false,
    display_order: project?.display_order || 0,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = MAX_IMAGES - formData.image_urls.length;
    if (remainingSlots <= 0) {
      setUploadError(`You've reached the ${MAX_IMAGES}-image limit for this project.`);
      e.target.value = '';
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    const invalidFile = filesToUpload.find((f) => !['image/png', 'image/jpeg', 'image/jpg'].includes(f.type));
    if (invalidFile) {
      setUploadError('Please choose only PNG or JPG images.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const uploadedUrls: string[] = [];

      for (const file of filesToUpload) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadErr } = await supabase.storage
          .from('project-images')
          .upload(fileName, file, { upsert: false });

        if (uploadErr) throw uploadErr;

        const { data: publicUrlData } = supabase.storage
          .from('project-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrlData.publicUrl);
      }

      setFormData((prev) => ({
        ...prev,
        image_urls: [...prev.image_urls, ...uploadedUrls],
        image_url: prev.image_url || uploadedUrls[0],
      }));

      if (files.length > remainingSlots) {
        setUploadError(`Only added ${remainingSlots} image(s) — the ${MAX_IMAGES}-image limit was reached.`);
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Upload failed. Make sure the "project-images" storage bucket exists and is public.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (urlToRemove: string) => {
    setFormData((prev) => {
      const updated = prev.image_urls.filter((url) => url !== urlToRemove);
      return {
        ...prev,
        image_urls: updated,
        image_url: prev.image_url === urlToRemove ? (updated[0] || '') : prev.image_url,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card w-full max-w-2xl p-6 my-8 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-100">
            {project ? 'Edit Project' : 'Add New Project'}
          </h3>
          <button onClick={onCancel} className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Project Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                placeholder="My Awesome Project"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Technologies (comma-separated) *</label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="input"
                placeholder="React, Node.js, MongoDB"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input min-h-[100px] resize-none"
              placeholder="Describe your project..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Project Images (PNG or JPG, up to {MAX_IMAGES})
            </label>
            <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed border-slate-600 text-slate-400 hover:text-slate-200 hover:border-slate-500 cursor-pointer transition-colors">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span className="text-sm">
                {uploading ? 'Uploading...' : `Choose images (${formData.image_urls.length}/${MAX_IMAGES})`}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading || formData.image_urls.length >= MAX_IMAGES}
              />
            </label>
            {uploadError && (
              <p className="mt-2 text-sm text-red-400">{uploadError}</p>
            )}

            {formData.image_urls.length > 0 && (
              <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
                {formData.image_urls.map((url) => (
                  <div key={url} className="relative group/thumb aspect-square">
                    <img
                      src={url}
                      alt="Uploaded"
                      className="w-full h-full object-cover rounded-lg border border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Live Demo URL</label>
              <input
                type="url"
                value={formData.live_url}
                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                className="input"
                placeholder="https://demo.example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">GitHub URL</label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="input"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                className="input"
                min="0"
              />
            </div>
            <div className="flex items-end pb-2.5">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                />
                <label htmlFor="featured" className="text-sm text-slate-300">
                  Mark as Featured Project
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={uploading} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
              <Check className="w-4 h-4" />
              {project ? 'Update' : 'Add'} Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Projects() {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const { isAdmin, setShowLogin, logout } = useAdmin();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  const [lightbox, setLightbox] = useState<{ project: Project; startIndex: number } | null>(null);

  const handleOpenLightbox = (project: Project, startIndex: number) => {
    setLightbox({ project, startIndex });
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
    }
  };

  const handleSave = async (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data);
      } else {
        await createProject(data);
      }
      setShowForm(false);
      setEditingProject(null);
    } catch (err: any) {
      const msg = err?.message || err?.error_description || err?.details || JSON.stringify(err);
      alert(`Failed to save project: ${msg}`);
      console.error('Save project error:', err);
    }
  };

  const filteredProjects = filter === 'featured'
    ? projects.filter(p => p.featured)
    : projects;

  if (loading) {
    return (
      <section id="projects" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-10 w-48 bg-slate-800 rounded-lg animate-pulse mx-auto mb-4" />
            <div className="h-6 w-96 bg-slate-800 rounded animate-pulse mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-dots-pattern opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="section-title gradient-text">Featured Projects</h2>
          <p className="section-subtitle mx-auto">
            A collection of my recent work showcasing full-stack development skills
          </p>
          <button
            onClick={() => (isAdmin ? logout() : setShowLogin(true))}
            className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isAdmin
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
            }`}
          >
            {isAdmin ? 'Exit Admin Mode' : 'Admin Login'}
          </button>
        </div>

        {isAdmin && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setFilter('featured')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'featured'
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                }`}
              >
                Featured Only
              </button>
            </div>
            <button
              onClick={() => {
                setEditingProject(null);
                setShowForm(true);
              }}
              className="btn-primary"
            >
              <Plus className="w-5 h-5" />
              Add Project
            </button>
          </div>
        )}

        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <Folder className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No projects found</p>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingProject(null);
                  setShowForm(true);
                }}
                className="btn-primary mt-4"
              >
                <Plus className="w-5 h-5" />
                Add Your First Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProjectCard
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onOpenLightbox={handleOpenLightbox}
                  isAdmin={isAdmin}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
        />
      )}

      {lightbox && (
        <ProjectLightbox
          project={lightbox.project}
          startIndex={lightbox.startIndex}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}