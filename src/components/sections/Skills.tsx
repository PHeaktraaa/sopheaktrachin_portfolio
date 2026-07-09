import { useState } from 'react';
import { useSkills } from '../../hooks/useData';
import { useAdmin } from '../../contexts/AdminContext';
import { Palette, PenTool, Image, Layers, Sparkles, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import type { Skill } from '../../lib/supabase';

const CATEGORY = 'Graphic Design';

const skillIcons: Record<string, React.ElementType> = {
  'palette': Palette,
  'pen-tool': PenTool,
  'image': Image,
  'figma': Sparkles,
  'sparkles': Sparkles,
  'layers': Layers,
};

function SkillCard({ skill, onEdit, onDelete, isAdmin }: { skill: Skill; onEdit: (skill: Skill) => void; onDelete: (id: string) => void; isAdmin: boolean }) {
  const IconComponent = skill.icon ? (skillIcons[skill.icon] || Palette) : Palette;

  return (
    <div className="group relative card-hover p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400">
          <IconComponent className="w-5 h-5 text-white" />
        </div>
        {isAdmin && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(skill)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-primary-400 hover:bg-slate-800 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(skill.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-3">{skill.name}</h3>
      <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-1000"
          style={{ width: `${skill.proficiency}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm">
        <span className="text-slate-500">{skill.category}</span>
        <span className="text-slate-400 font-medium">{skill.proficiency}%</span>
      </div>
    </div>
  );
}

function SkillForm({ skill, onSave, onCancel }: { skill?: Skill | null; onSave: (data: Omit<Skill, 'id'>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: skill?.name || '',
    category: CATEGORY,
    proficiency: skill?.proficiency || 80,
    icon: skill?.icon || 'palette',
    display_order: skill?.display_order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-100">
            {skill ? 'Edit Skill' : 'Add New Skill'}
          </h3>
          <button onClick={onCancel} className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Skill Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="e.g., Photoshop, Illustrator"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Icon</label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="input"
            >
              <option value="palette">Palette</option>
              <option value="pen-tool">Pen Tool</option>
              <option value="image">Image</option>
              <option value="figma">Figma</option>
              <option value="layers">Layers</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Proficiency: {formData.proficiency}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.proficiency}
              onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              <Check className="w-4 h-4" />
              {skill ? 'Update' : 'Add'} Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Skills() {
  const { skills, loading, createSkill, updateSkill, deleteSkill } = useSkills();
  const { isAdmin, setShowLogin, logout } = useAdmin();
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showForm, setShowForm] = useState(false);

  const designSkills = skills.filter((s) => s.category === CATEGORY);

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
      const msg = err?.message || err?.error_description || err?.details || JSON.stringify(err);
      alert(`Failed to save skill: ${msg}`);
      console.error('Save skill error:', err);
    }
  };

  if (loading) {
    return (
      <section id="skills" className="py-20 md:py-32 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-10 w-48 bg-slate-800 rounded-lg animate-pulse mx-auto mb-4" />
            <div className="h-6 w-96 bg-slate-800 rounded animate-pulse mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-40 bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 md:py-32 bg-slate-900/50 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="section-title gradient-text">Design Skills</h2>
          <p className="section-subtitle mx-auto">
            Graphic design tools and techniques I use to bring ideas to life
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
          <div className="flex justify-center mb-8">
            <button
              onClick={() => {
                setEditingSkill(null);
                setShowForm(true);
              }}
              className="btn-primary"
            >
              <Plus className="w-5 h-5" />
              Add New Skill
            </button>
          </div>
        )}

        {designSkills.length === 0 ? (
          <div className="text-center py-16">
            <Palette className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No design skills added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {designSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isAdmin={isAdmin}
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