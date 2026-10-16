import { useState } from 'react';
import { useExperience } from '../../hooks/useData';
import { useAdmin } from '../../contexts/AdminContext';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import type { Experience } from '../../lib/supabase';

function ExperienceForm({
  experience,
  onSave,
  onCancel,
}: {
  experience?: Experience | null;
  onSave: (data: Omit<Experience, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    type: experience?.type || ('work' as 'education' | 'work'),
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
    <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg border border-line p-6 sm:p-8 max-w-lg w-full">
        <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-line">
          <h3 className="font-serif text-2xl font-normal text-ink">
            {experience ? 'Edit Record' : 'Add Background Entry'}
          </h3>
          <button onClick={onCancel} className="text-ink-muted hover:text-ink p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted mb-2">
              Entry Type
            </label>
            <div className="flex gap-2">
              {(['education', 'work'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: t })}
                  className={`flex-1 py-2 font-mono text-xs uppercase tracking-wider border transition-colors ${
                    formData.type === t
                      ? 'border-ink bg-ink text-bg'
                      : 'border-line text-ink-muted hover:border-ink'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted mb-2">
              Title / Degree *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder="e.g. Bachelor of Science in Software Engineering"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted mb-2">
              Institution / Company *
            </label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="input"
              placeholder="e.g. University / Agency"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted mb-2">
                End Date (Empty = Present)
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted mb-2">
              Notes / Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input min-h-[80px] resize-none"
              placeholder="Key coursework, accomplishments, or scope..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-line">
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              <Check className="w-4 h-4 mr-1" />
              {experience ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ExperienceSection() {
  const { experiences, loading, createExperience, updateExperience, deleteExperience } =
    useExperience();
  const { isAdmin } = useAdmin();
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'education' | 'work'>('all');

  const filtered =
    activeTab === 'all' ? experiences : experiences.filter((e) => e.type === activeTab);

  const handleEdit = (exp: Experience) => {
    setEditingExperience(exp);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
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
    } catch (err: any) {
      alert(`Error saving record: ${err?.message || 'Unknown error'}`);
    }
  };

  const formatPeriod = (start: string, end: string | null) => {
    const s = new Date(start).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
    const e = end
      ? new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : 'Present';
    return `${s} — ${e}`;
  };

  return (
    <section id="experience" className="py-24 md:py-32 border-b border-line">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-16 pb-6 border-b border-line gap-4">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-sm text-ink-soft">04</span>
            <h2 className="section-title">Background</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 font-mono text-xs">
              {(['all', 'education', 'work'] as const).map((tab, idx) => (
                <div key={tab} className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`py-1 capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-ink font-medium border-b border-ink'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {tab}
                  </button>
                  {idx < 2 && <span className="text-line-dark">/</span>}
                </div>
              ))}
            </div>

            {isAdmin && (
              <button
                onClick={() => {
                  setEditingExperience(null);
                  setShowForm(true);
                }}
                className="btn-primary py-1 px-3 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Entry
              </button>
            )}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="divide-y divide-line">
            {[1, 2, 3].map((n) => (
              <div key={n} className="py-8 grid lg:grid-cols-12 gap-6 animate-pulse">
                <div className="lg:col-span-3 h-4 bg-line w-28" />
                <div className="lg:col-span-9 space-y-3">
                  <div className="h-6 bg-line w-1/2" />
                  <div className="h-4 bg-line w-1/3" />
                  <div className="h-12 bg-line w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center border border-dashed border-line">
            <p className="text-ink-muted font-mono text-sm">No records found.</p>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingExperience(null);
                  setShowForm(true);
                }}
                className="btn-primary mt-4"
              >
                <Plus className="w-4 h-4 mr-1" /> Add First Entry
              </button>
            )}
          </div>
        )}

        {/* Two-column Chronological List with Mono Dates on the Left */}
        {!loading && filtered.length > 0 && (
          <div className="divide-y divide-line">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12 group"
              >
                {/* Left: Date & Type */}
                <div className="lg:col-span-3">
                  <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                    {formatPeriod(item.start_date, item.end_date)}
                  </p>
                  <p className="font-mono text-[11px] text-ink-soft uppercase mt-1">
                    {item.type}
                  </p>
                </div>

                {/* Right: Title, Organization, Description, Admin */}
                <div className="lg:col-span-9">
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <h3 className="font-serif text-xl sm:text-2xl font-normal text-ink group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>

                    {isAdmin && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-ink-muted hover:text-ink"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-ink-muted hover:text-accent"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="font-sans text-sm font-medium text-ink-muted mb-3">
                    {item.organization}
                  </p>

                  {item.description && (
                    <p className="text-sm text-ink-muted leading-relaxed font-light max-w-2xl">
                      {item.description}
                    </p>
                  )}
                </div>
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