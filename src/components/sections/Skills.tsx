import { useState, useEffect, useRef } from 'react';
import { useSkills } from '../../hooks/useData';
import { useAdmin } from '../../contexts/AdminContext';
import { Plus, Pencil, Trash2, X, Check, Loader2 } from 'lucide-react';
import type { Skill } from '../../lib/supabase';

// Helper to match category gracefully across 'Tools / Design' or 'Graphic Design'
export const isToolsOrDesignSkill = (category: string) => {
  const norm = (category || '').trim().toLowerCase();
  return (
    norm === 'tools / design' ||
    norm === 'tools/design' ||
    norm === 'graphic design' ||
    norm === 'tools & design' ||
    norm === 'design'
  );
};

const DEFAULT_CATEGORY = 'Tools / Design';

interface SkillRowProps {
  skill: Skill;
  isAdmin: boolean;
  onEdit: (skill: Skill) => void;
  onDelete: (id: string) => void;
  onUpdateProficiency: (id: string, newProficiency: number) => Promise<void>;
}

function SkillRow({
  skill,
  isAdmin,
  onEdit,
  onDelete,
  onUpdateProficiency,
}: SkillRowProps) {
  const [val, setVal] = useState<number>(skill.proficiency);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [isVisible, setIsVisible] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  // Sync internal state if skill proficiency changes externally (e.g. Realtime or form edit)
  useEffect(() => {
    setVal(skill.proficiency);
  }, [skill.proficiency]);

  // Animate progress bar once when row scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (rowRef.current) {
      observer.observe(rowRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCommit = async (committedVal: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(committedVal)));
    if (clamped === skill.proficiency) return;

    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await onUpdateProficiency(skill.id, clamped);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      setVal(skill.proficiency); // revert on error
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal(parseInt(e.target.value, 10));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    setVal(isNaN(parsed) ? 0 : parsed);
  };

  const handleNumberBlur = () => {
    handleCommit(val);
  };

  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommit(val);
    }
  };

  return (
    <div
      ref={rowRef}
      className="py-4 border-b border-line group transition-colors duration-150"
    >
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg font-normal text-ink group-hover:text-accent transition-colors">
            {skill.name}
          </span>

          {isAdmin && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(skill)}
                className="p-1 text-muted hover:text-ink transition-colors"
                title="Edit name"
                aria-label={`Edit ${skill.name}`}
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(skill.id)}
                className="p-1 text-muted hover:text-red-500 transition-colors"
                title="Delete skill"
                aria-label={`Delete ${skill.name}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {saveStatus === 'saved' && (
            <span className="font-mono text-[11px] text-accent flex items-center gap-0.5">
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="font-mono text-[11px] text-red-500">
              Save failed
            </span>
          )}
          {isSaving && (
            <Loader2 className="w-3 h-3 animate-spin text-muted" />
          )}

          <span className="font-mono text-sm text-ink font-medium min-w-[3ch] text-right">
            {val}%
          </span>
        </div>
      </div>

      {/* Thin 2.5px flat progress bar: track line color, fill accent blue */}
      <div className="relative w-full h-[3px] bg-line overflow-hidden">
        <div
          className="h-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: isVisible ? `${val}%` : '0%' }}
        />
      </div>

      {/* Admin live inline adjuster (slider + small number input) */}
      {isAdmin && (
        <div className="mt-3 pt-2 flex items-center gap-3 bg-surface/60 px-3 py-1.5 border border-line">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted shrink-0">
            Adjust:
          </span>

          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={val}
            onChange={handleSliderChange}
            onMouseUp={() => handleCommit(val)}
            onTouchEnd={() => handleCommit(val)}
            className="w-full h-1 bg-line appearance-none cursor-pointer accent-accent"
            aria-label={`Adjust percentage for ${skill.name}`}
          />

          <div className="flex items-center gap-1 shrink-0">
            <input
              type="number"
              min="0"
              max="100"
              value={val}
              onChange={handleNumberChange}
              onBlur={handleNumberBlur}
              onKeyDown={handleNumberKeyDown}
              className="w-14 px-1.5 py-0.5 bg-bg border border-line text-xs font-mono text-ink text-center focus:outline-none focus:border-accent"
              aria-label={`Enter exact percentage for ${skill.name}`}
            />
            <span className="font-mono text-xs text-muted">%</span>
          </div>
        </div>
      )}
    </div>
  );
}

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
    category: DEFAULT_CATEGORY,
    proficiency: skill?.proficiency ?? 80,
    icon: skill?.icon || 'palette',
    display_order: skill?.display_order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      proficiency: Math.max(0, Math.min(100, Number(formData.proficiency) || 80)),
    });
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
              placeholder="e.g. Adobe Illustrator, Figma, Photoshop"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">
              Category
            </label>
            <input
              type="text"
              value={DEFAULT_CATEGORY}
              disabled
              className="input bg-band/40 cursor-not-allowed opacity-80 font-mono text-xs"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-mono text-xs uppercase tracking-wider text-muted">
                Proficiency (0 - 100%)
              </label>
              <span className="font-mono text-xs text-ink font-medium">
                {formData.proficiency}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.proficiency}
              onChange={(e) =>
                setFormData({ ...formData, proficiency: parseInt(e.target.value, 10) })
              }
              className="w-full h-1.5 bg-line appearance-none cursor-pointer accent-accent"
            />
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

  // Filter skills to display ONLY "Tools / Design" (or existing "Graphic Design") skills
  const displayedSkills = skills.filter((s) => isToolsOrDesignSkill(s.category));

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      await deleteSkill(id);
    }
  };

  const handleUpdateProficiency = async (id: string, newProficiency: number) => {
    await updateSkill(id, { proficiency: newProficiency });
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="py-4 border-b border-line animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="h-4 w-32 bg-line" />
                  <div className="h-4 w-10 bg-line" />
                </div>
                <div className="h-[3px] w-full bg-line" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && displayedSkills.length === 0 && (
          <div className="py-16 text-center border border-dashed border-line">
            <p className="text-muted font-mono text-sm">No design tools listed yet.</p>
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

        {/* 2-Column Responsive Grid with Clean Rows */}
        {!loading && displayedSkills.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-2">
            {displayedSkills.map((skill) => (
              <SkillRow
                key={skill.id}
                skill={skill}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onUpdateProficiency={handleUpdateProficiency}
              />
            ))}
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