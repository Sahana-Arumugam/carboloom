import React, { useState } from 'react';
import { Challenge } from '../types';

interface LogProgressModalProps {
  challenge: Challenge;
  onClose: () => void;
  onLog: (value: number) => void;
}

export const LogProgressModal: React.FC<LogProgressModalProps> = ({ challenge, onClose, onLog }) => {
  const [value, setValue] = useState<number | ''>('');
  const [error, setError] = useState('');

  const handleLog = () => {
    if (typeof value !== 'number' || value <= 0) {
      setError('Please enter a positive number.');
      return;
    }
    onLog(value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-card rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-text mb-2">Log Progress for</h3>
        <p className="text-primary font-semibold mb-4">{challenge.name}</p>
        
        <label htmlFor="progress-value" className="block text-sm font-medium text-text-secondary mb-1">
          How much progress did you make today? ({challenge.unit})
        </label>
        <input
          type="number"
          id="progress-value"
          value={value}
          onChange={(e) => {
            setValue(e.target.value === '' ? '' : Number(e.target.value));
            setError('');
          }}
          min="0"
          className={`w-full p-2 border rounded-md bg-background text-text focus:ring-2 focus:ring-primary focus:border-transparent ${error ? 'border-red-500' : 'border-border'}`}
          placeholder={`e.g., 5`}
          aria-label={`Progress in ${challenge.unit}`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="py-2 px-4 font-semibold text-text-secondary rounded-full hover:bg-border transition-colors">Cancel</button>
          <button onClick={handleLog} className="py-2 px-5 font-bold text-white bg-primary rounded-full hover:bg-primary-dark transition-colors">Log</button>
        </div>
      </div>
    </div>
  );
};
