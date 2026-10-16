import { useState, useEffect, useRef } from 'react';
import { useProjects } from '../../hooks/useData';
import { useAdmin } from '../../contexts/AdminContext';
import { supabase } from '../../lib/supabase';
import {
  ArrowUpRight,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Upload,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Project } from '../../lib/supabase';

const MAX_IMAGES = 20;

function ProjectRow({
  project,
  index,
  onEdit,
  onDelete,
  onOpenLightbox,
  isAdmin,
}: {
  project: Project;
  index: number;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onOpenLightbox: (project: Project, startIndex: number) => void;
  isAdmin: boolean;
}) {
  const images =
    project.image_urls && project.image_urls.length > 0
      ? project.image_urls
      : [
          project.image_url ||
            'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800',
        ];
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <article className="border-t border-line py-12 lg:py-16 group">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Number, Title, Description, Metadata */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 font-mono text-xs text-ink-muted mb-3">
              <span>{String(index + 1).padStart(2, '0')}</span>
              {project.featured && (
                <>
                  <span>/</span>
                  <span className="text-accent uppercase tracking-wider font-medium">
                    Featured
                  </span>
                </>
              )}
            </div>

            <h3
              onClick={() => onOpenLightbox(project, activeImgIndex)}
              className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-ink group-hover:text-accent transition-colors duration-150 cursor-pointer mb-4 leading-tight"
            >
              {project.title}
            </h3>

            <p className="text-ink-muted text-sm sm:text-base leading-relaxed mb-6 font-light">
              {project.description}
            </p>

            {/* Plain-text Tech Tags (no glass pills) */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-ink-soft mb-8">
              {project.technologies.map((tech) => (
                <span key={tech} className="after:content-[','] last:after:content-['']">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links & Admin CRUD */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-line">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono uppercase tracking-wider text-ink hover:text-accent inline-flex items-center gap-1 transition-colors"
              >
                Live Demo
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink inline-flex items-center gap-1 transition-colors"
              >
                Source Code
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => onOpenLightbox(project, activeImgIndex)}
              className="text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink inline-flex items-center gap-1 transition-colors"
            >
              Gallery ({images.length})
            </button>

            {isAdmin && (
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => onEdit(project)}
                  className="font-mono text-xs px-2 py-1 border border-line text-ink-muted hover:border-ink hover:text-ink transition-colors flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => onDelete(project.id)}
                  className="font-mono text-xs px-2 py-1 border border-line text-ink-muted hover:border-accent hover:text-accent transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Large Image Presentation */}
        <div className="lg:col-span-7">
          <div
            className="relative border border-line bg-white p-2.5 cursor-pointer overflow-hidden"
            onClick={() => onOpenLightbox(project, activeImgIndex)}
          >
            <div className="aspect-[16/10] overflow-hidden bg-bg-subtle relative">
              <img
                src={images[activeImgIndex]}
                alt={`${project.title} screenshot ${activeImgIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />

              {/* In-row pagination if multi-image */}
              {images.length > 1 && (
                <div
                  className="absolute bottom-3 right-3 bg-ink/90 text-bg px-2.5 py-1 text-xs font-mono flex items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>
                    {activeImgIndex + 1}/{images.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={prevImage}
                      className="p-0.5 hover:text-accent transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="p-0.5 hover:text-accent transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectLightbox({
  project,
  startIndex,
  onClose,
}: {
  project: Project;
  startIndex: number;
  onClose: () => void;
}) {
  const images =
    project.image_urls && project.image_urls.length > 0
      ? project.image_urls
      : [
          project.image_url ||
            'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800',
        ];
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
      className="fixed inset-0 bg-ink/95 z-[100] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-bg z-10 border-b border-ink-muted/30 pb-4">
        <div>
          <p className="font-serif text-lg font-normal">{project.title}</p>
          <p className="font-mono text-xs text-ink-soft">
            Figure {index + 1} of {images.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-ink-soft hover:text-bg transition-colors"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Container */}
      <div
        className="relative max-w-5xl max-h-[75vh] w-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[index]}
          alt={`${project.title} - ${index + 1}`}
          className="max-w-full max-h-[75vh] object-contain select-none"
          draggable={false}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 p-2 bg-ink/80 text-bg border border-ink-muted/40 hover:border-bg transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 p-2 bg-ink/80 text-bg border border-ink-muted/40 hover:border-bg transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project?: Project | null;
  onSave: (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    technologies: project?.technologies ? project.technologies.join(', ') : '',
    image_url: project?.image_url || '',
    image_urls: project?.image_urls || (project?.image_url ? [project.image_url] : []),
    live_url: project?.live_url || '',
    github_url: project?.github_url || '',
    featured: project?.featured || false,
    display_order: project?.display_order || 0,
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_IMAGES - formData.image_urls.length;
    if (remainingSlots <= 0) {
      setUploadError(`Maximum of ${MAX_IMAGES} images reached.`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

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
        setUploadError(`Only added ${remainingSlots} image(s) due to limit.`);
      }
    } catch (err: any) {
      setUploadError(
        err?.message || 'Upload failed. Check Supabase project-images bucket.'
      );
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
        image_url: prev.image_url === urlToRemove ? updated[0] || '' : prev.image_url,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      technologies: formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-bg border border-line p-6 sm:p-8 max-w-2xl w-full my-8">
        <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-line">
          <h3 className="font-serif text-2xl font-normal text-ink">
            {project ? 'Edit Project' : 'Add New Project'}
          </h3>
          <button onClick={onCancel} className="text-ink-muted hover:text-ink p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                placeholder="Title"
                required
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted mb-2">
                Technologies (comma-separated) *
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="input"
                placeholder="React, TypeScript, Supabase"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input min-h-[90px] resize-none"
              placeholder="Concrete overview of scope, problem, and implementation..."
              required
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted mb-2">
              Images ({formData.image_urls.length}/{MAX_IMAGES})
            </label>
            <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-line-dark hover:border-ink cursor-pointer transition-colors bg-white">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 text-ink-muted" />
              )}
              <span className="font-mono text-xs text-ink-muted">
                {uploading ? 'Uploading...' : 'Upload PNG / JPG'}
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
              <p className="mt-2 text-xs font-mono text-accent">{uploadError}</p>
            )}

            {formData.image_urls.length > 0 && (
              <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
                {formData.image_urls.map((url) => (
                  <div key={url} className="relative group/thumb aspect-square border border-line">
                    <img
                      src={url}
                      alt="Uploaded thumb"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute -top-1.5 -right-1.5 p-1 bg-accent text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity"
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
              <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted mb-2">
                Live URL
              </label>
              <input
                type="url"
                value={formData.live_url}
                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                className="input"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted mb-2">
                GitHub Repository
              </label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="input"
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display_order: parseInt(e.target.value) || 0,
                  })
                }
                className="input"
                min="0"
              />
            </div>
            <div className="flex items-end pb-2.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded-none border-line-dark text-ink focus:ring-0"
                />
                <span className="font-mono text-xs uppercase tracking-wider text-ink">
                  Feature in overview
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-line">
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              <Check className="w-4 h-4 mr-1" />
              {project ? 'Update' : 'Save'} Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Projects() {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const { isAdmin } = useAdmin();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  const [lightbox, setLightbox] = useState<{ project: Project; startIndex: number } | null>(
    null
  );

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
      const msg = err?.message || 'Failed to save project';
      alert(`Error: ${msg}`);
      console.error(err);
    }
  };

  const filteredProjects =
    filter === 'featured' ? projects.filter((p) => p.featured) : projects;

  return (
    <section id="projects" className="py-24 md:py-32 border-b border-line">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 pb-6 border-b border-line gap-4">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-sm text-ink-soft">03</span>
            <h2 className="section-title">Selected Work</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`py-1 transition-colors ${
                  filter === 'all'
                    ? 'text-ink font-medium border-b border-ink'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                All ({projects.length})
              </button>
              <span className="text-line-dark">/</span>
              <button
                onClick={() => setFilter('featured')}
                className={`py-1 transition-colors ${
                  filter === 'featured'
                    ? 'text-ink font-medium border-b border-ink'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Featured ({projects.filter((p) => p.featured).length})
              </button>
            </div>

            {isAdmin && (
              <button
                onClick={() => {
                  setEditingProject(null);
                  setShowForm(true);
                }}
                className="btn-primary py-1 px-3 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Project
              </button>
            )}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="divide-y divide-line">
            {[1, 2].map((n) => (
              <div key={n} className="py-12 animate-pulse grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 space-y-4">
                  <div className="h-4 w-16 bg-line" />
                  <div className="h-8 w-3/4 bg-line" />
                  <div className="h-16 w-full bg-line" />
                </div>
                <div className="lg:col-span-7 h-64 bg-line" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredProjects.length === 0 && (
          <div className="py-20 text-center border border-dashed border-line">
            <p className="text-ink-muted font-mono text-sm">No projects to display.</p>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingProject(null);
                  setShowForm(true);
                }}
                className="btn-primary mt-4"
              >
                <Plus className="w-4 h-4 mr-1" /> Add First Project
              </button>
            )}
          </div>
        )}

        {/* Project Rows */}
        {!loading && filteredProjects.length > 0 && (
          <div>
            {filteredProjects.map((project, index) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onOpenLightbox={handleOpenLightbox}
                isAdmin={isAdmin}
              />
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