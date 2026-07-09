import { useState } from 'react';
import { useExperience } from '../../hooks/useData';
import { useAdmin } from '../../contexts/AdminContext';
import { GraduationCap, Briefcase, Plus, Pencil, Trash2, X, Check, Calendar } from 'lucide-react';
import type { Experience } from '../../lib/supabase';

function ExperienceCard({ experience, onEdit, onDelete, isAdmin }: { experience: Experience; onEdit: (exp: Experience) => void; onDelete: (id: string) => void; isAdmin: boolean }) {
  const IconComponent = experience.type === 'education' ? GraduationCap : Briefcase;
  const startDate = new Date(experience.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const endDate = experience.end_date
    ? new Date(experience.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Present';

  return (
    <div className="group relative card-hover p-6">
      <div className="flex items-start gap-4">
        <div className={`shrink-0 p-3 rounded-xl ${experience.type === 'education' ? 'bg-gradient-to-br from-blue-600 to-cyan-500' : 'bg-gradient-to-br from-green-600 to-emerald-500'}`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-100 group-hover:text-primary-400 transition-colors">
                {experience.title}
              </h3>
              <p className="text-primary-400 font-medium">{experience.organization}</p>
            </div>
            {isAdmin && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => onEdit(experience)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-primary-400 hover:bg-slate-800 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(experience.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            <span>{startDate} - {endDate}</span>
          </div>
          {experience.description && (
            <p className="mt-3 text-slate-400 text-sm leading-relaxed">
              {experience.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ExperienceForm({ experience, onSave, onCancel }: { experience?: Experience | null; onSave: (data: Omit<Experience, 'id' | 'created_at'>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    type: experience?.type || 'work' as 'education' | 'work',
    title: experience?.title || '',
    organization: experience?.organization || '',
    description: experience?.description || '',
    start_date: experience?.start_date || new Date().toISOString().split('T')[0],
    end_date: experience?.end_date || '',
    display_order: experience?.display_order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      end_date: formData.end_date || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-lg p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-100">
            {experience ? 'Edit Experience' : 'Add New Experience'}
          </h3>
          <button onClick={onCancel} className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'education' })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  formData.type === 'education'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
                Education
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'work' })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  formData.type === 'work'
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                Work
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {formData.type === 'education' ? 'Degree / Certificate' : 'Job Title'} *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder={formData.type === 'education' ? 'Bachelor of Science in Computer Science' : 'Frontend Developer'}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {formData.type === 'education' ? 'Institution' : 'Company'} *
            </label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="input"
              placeholder={formData.type === 'education' ? 'University of Technology' : 'Tech Solutions Inc.'}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Start Date *</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="input"
              />
              <p className="text-xs text-slate-500 mt-1">Leave empty if current</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input min-h-[80px] resize-none"
              placeholder="Describe your responsibilities, achievements, or coursework..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              <Check className="w-4 h-4" />
              {experience ? 'Update' : 'Add'} Experience
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ExperienceSection() {
  const { experiences, loading, createExperience, updateExperience, deleteExperience } = useExperience();
  const { isAdmin, setShowLogin, logout } = useAdmin();
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'education' | 'work'>('all');

  const educationList = experiences.filter(e => e.type === 'education');
  const workList = experiences.filter(e => e.type === 'work');

  const filteredExperiences = activeTab === 'all'
    ? experiences
    : activeTab === 'education' ? educationList : workList;

  const handleEdit = (exp: Experience) => {
    setEditingExperience(exp);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      await deleteExperience(id);
    }
  };

  const handleSave = async (data: Omit<Experience, 'id' | 'created_at'>) => {
    try {
      if (editingExperience) {
        await updateExperience(editingExperience.id, data);
      } else {
        await createExperience(data);
      }
      setShowForm(false);
      setEditingExperience(null);
    } catch (err) {
      alert(`Failed to save experience: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <section id="experience" className="py-20 md:py-32 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-10 w-48 bg-slate-800 rounded-lg animate-pulse mx-auto mb-4" />
            <div className="h-6 w-96 bg-slate-800 rounded animate-pulse mx-auto" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 md:py-32 bg-slate-900/50 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="section-title gradient-text">Education & Experience</h2>
          <p className="section-subtitle mx-auto">
            My academic journey and professional background
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

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex gap-2">
            {(['all', 'education', 'work'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                }`}
              >
                {tab === 'education' && <GraduationCap className="w-4 h-4" />}
                {tab === 'work' && <Briefcase className="w-4 h-4" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {isAdmin && (
            <button
              onClick={() => {
                setEditingExperience(null);
                setShowForm(true);
              }}
              className="btn-primary"
            >
              <Plus className="w-5 h-5" />
              Add Experience
            </button>
          )}
        </div>

        {filteredExperiences.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No experience entries found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExperiences.map((exp, index) => (
              <div
                key={exp.id}
                className="animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ExperienceCard
                  experience={exp}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isAdmin={isAdmin}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ExperienceForm
          experience={editingExperience}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingExperience(null);
          }}
        />
      )}
    </section>
  );
}