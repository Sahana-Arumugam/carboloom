import React, { useState } from 'react';
import { Challenge } from '../types';

interface CreateChallengeModalProps {
  onClose: () => void;
  onSave: (challengeData: Omit<Challenge, 'id' | 'isCustom'>) => void;
  challengeToEdit: Challenge | null;
}

const EMOJI_ICONS = ['🎯', '🏃', '🚴', '♻️', '💡', '🌳', '💧', '🛍️', '🍎', '🧘', '📚', '💪'];

export const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({ onClose, onSave, challengeToEdit }) => {
  const [formData, setFormData] = useState({
    name: challengeToEdit?.name || '',
    description: challengeToEdit?.description || '',
    icon: challengeToEdit?.icon || '🎯',
    goal: challengeToEdit?.goal || 1,
    unit: challengeToEdit?.unit || 'days',
    type: challengeToEdit?.type || 'streak',
    reward: challengeToEdit?.reward || 50,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (formData.goal <= 0) newErrors.goal = 'Goal must be positive.';
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required.';
    if (formData.reward < 0) newErrors.reward = 'Reward cannot be negative.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumber = ['goal', 'reward'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };

  const handleIconSelect = (icon: string) => {
    setFormData(prev => ({ ...prev, icon }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-text">{challengeToEdit ? 'Edit' : 'Create'} Custom Challenge</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-grow space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Icon</label>
            <div className="flex flex-wrap gap-2 p-2 bg-background rounded-md">
              {EMOJI_ICONS.map(icon => (
                <button
                  type="button"
                  key={icon}
                  onClick={() => handleIconSelect(icon)}
                  className={`text-2xl p-2 rounded-full transition-all duration-200 ${formData.icon === icon ? 'bg-primary/20 scale-110 ring-2 ring-primary' : 'hover:bg-border'}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full p-2 bg-background border rounded-md ${errors.name ? 'border-red-500' : 'border-border'}`} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full p-2 bg-background border border-border rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-text-secondary mb-1">Type</label>
              <select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full p-2 bg-background border border-border rounded-md">
                <option value="streak">Streak (e.g., for consecutive days)</option>
                <option value="daily">Daily Total (e.g., for distance, items)</option>
              </select>
            </div>
             <div>
              <label htmlFor="unit" className="block text-sm font-medium text-text-secondary mb-1">Unit</label>
              <input type="text" id="unit" name="unit" value={formData.unit} onChange={handleChange} className={`w-full p-2 bg-background border rounded-md ${errors.unit ? 'border-red-500' : 'border-border'}`} />
               {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-text-secondary mb-1">Goal</label>
              <input type="number" id="goal" name="goal" value={formData.goal} onChange={handleChange} min="1" className={`w-full p-2 bg-background border rounded-md ${errors.goal ? 'border-red-500' : 'border-border'}`} />
              {errors.goal && <p className="text-red-500 text-xs mt-1">{errors.goal}</p>}
            </div>
            <div>
              <label htmlFor="reward" className="block text-sm font-medium text-text-secondary mb-1">Reward (Points)</label>
              <input type="number" id="reward" name="reward" value={formData.reward} onChange={handleChange} min="0" className={`w-full p-2 bg-background border rounded-md ${errors.reward ? 'border-red-500' : 'border-border'}`} />
              {errors.reward && <p className="text-red-500 text-xs mt-1">{errors.reward}</p>}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-border bg-background flex items-center justify-end gap-4">
          <button onClick={onClose} className="py-2 px-5 font-semibold text-text-secondary rounded-full hover:bg-border transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="py-2 px-6 font-bold text-white bg-primary rounded-full hover:bg-primary-dark transition-all transform hover:scale-105">
            {challengeToEdit ? 'Save Changes' : 'Create Challenge'}
          </button>
        </div>
      </div>
    </div>
  );
};
