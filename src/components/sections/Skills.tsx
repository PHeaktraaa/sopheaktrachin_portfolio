import { useState } from 'react';
import { useSkills } from '../../hooks/useData';
import { useAdmin } from '../../contexts/AdminContext';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import type { Skill } from '../../lib/supabase';

const DEFAULT_CATEGORY = 'Tools / Design';

function SkillForm({
  skill,
  onSave,
  onCancel,
}: {
  skill?: Skill | null;
  onSave: (data: Omit<Skill, 'id'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: skill?.name || '',
    category: skill?.category || DEFAULT_CATEGORY,
    proficiency: skill?.proficiency || 80,
    icon: skill?.icon || 'palette',
    display_order: skill?.display_order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-ink/60 z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-line p-6 sm:p-8 max-w-md w-full text-ink">
        <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-line">
          <h3 className="font-serif text-2xl font-normal text-ink">
            {skill ? 'Edit Skill' : 'Add New Skill'}
          </h3>
          <button
            onClick={onCancel}
            className="text-muted hover:text-ink p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">
              Skill Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="e.g. React, PostgreSQL, Adobe Illustrator"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="Tools / Design">Tools / Design</option>
              <option value="Graphic Design">Graphic Design</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-line">
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              <Check className="w-4 h-4 mr-1" />
              {skill ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Skills() {
  const { skills, loading, createSkill, updateSkill, deleteSkill } = useSkills();
  const { isAdmin } = useAdmin();
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Group skills by category cleanly without fake percentage bars
  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const rawCat = skill.category || 'Tools / Design';
    const cat = rawCat === 'Graphic Design' ? 'Tools / Design' : rawCat;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  // Pre-seed canonical categories if not present
  const standardCategories = ['Frontend', 'Backend', 'Database', 'Tools / Design'];
  const allCategoryNames = Array.from(new Set([...standardCategories, ...Object.keys(groupedSkills)]));

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      await deleteSkill(id);
    }
  };

  const handleSave = async (data: Omit<Skill, 'id'>) => {
    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, data);
      } else {
        await createSkill(data);
      }
      setShowForm(false);
      setEditingSkill(null);
    } catch (err: any) {
      const msg = err?.message || 'Failed to save skill';
      alert(`Error: ${msg}`);
      console.error(err);
    }
  };

  return (
    <section id="skills" className="py-24 md:py-32 border-b border-line bg-bg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-16 pb-6 border-b border-line gap-4">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-sm text-accent">03</span>
            <h2 className="section-title">Skills &amp; Toolkit</h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              03 / Competencies
            </p>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingSkill(null);
                  setShowForm(true);
                }}
                className="btn-primary py-1 px-3 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Skill
              </button>
            )}
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="border-t border-line pt-6 animate-pulse">
                <div className="h-4 w-28 bg-line mb-6" />
                <div className="space-y-3">
                  <div className="h-4 w-3/4 bg-line" />
                  <div className="h-4 w-1/2 bg-line" />
                  <div className="h-4 w-2/3 bg-line" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && skills.length === 0 && (
          <div className="py-16 text-center border border-dashed border-line">
            <p className="text-muted font-mono text-sm">No skills added yet.</p>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingSkill(null);
                  setShowForm(true);
                }}
                className="btn-primary mt-4"
              >
                <Plus className="w-4 h-4 mr-1" /> Add First Skill
              </button>
            )}
          </div>
        )}

        {/* Grouped Plain-Text Columns */}
        {!loading && skills.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {allCategoryNames.map((category, catIdx) => {
              const categorySkills = groupedSkills[category] || [];
              return (
                <div key={category} className="border-t border-line pt-6">
                  <div className="flex items-baseline justify-between mb-5">
                    <h3 className="font-serif text-xl font-normal text-ink">
                      {category}
                    </h3>
                    <span className="font-mono text-xs text-muted">
                      ({String(catIdx + 1).padStart(2, '0')})
                    </span>
                  </div>

                  {categorySkills.length === 0 ? (
                    <p className="font-mono text-xs text-muted/60 py-2">
                      None listed
                    </p>
                  ) : (
                    <ul className="divide-y divide-line font-sans text-sm">
                      {categorySkills.map((skill) => (
                        <li
                          key={skill.id}
                          className="py-2.5 flex items-center justify-between group hover:text-accent transition-colors duration-150"
                        >
                          <span className="text-ink font-light group-hover:text-accent">
                            {skill.name}
                          </span>

                          {isAdmin && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(skill)}
                                className="p-1 text-muted hover:text-ink"
                                title="Edit"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDelete(skill.id)}
                                className="p-1 text-muted hover:text-accent"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <SkillForm
          skill={editingSkill}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingSkill(null);
          }}
        />
      )}
    </section>
  );
}