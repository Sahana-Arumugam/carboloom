import React, { useState, useMemo } from 'react';
import { ShoppingItem, ElectronicsItem } from '../types';
import { SHOPPING_DATA, ELECTRONICS_DATA } from '../constants';
import { TshirtIcon, JeansIcon, ShoesIcon, SmartphoneIcon, LaptopIcon, HeadphonesIcon } from './icons/CategoryIcons';

type WizardMode = 'clothing' | 'electronics';

interface AddItemWizardProps {
  mode: WizardMode;
  onClose: () => void;
  onAddItem: (item: ShoppingItem | ElectronicsItem) => void;
}

const getIcon = (key: string) => {
    const lowerKey = key.toLowerCase();
    if(lowerKey.includes('topwear')) return <TshirtIcon className="h-8 w-8 mx-auto mb-2 text-text-secondary" />;
    if(lowerKey.includes('bottomwear')) return <JeansIcon className="h-8 w-8 mx-auto mb-2 text-text-secondary" />;
    if(lowerKey.includes('footwear')) return <ShoesIcon className="h-8 w-8 mx-auto mb-2 text-text-secondary" />;
    if(lowerKey.includes('mobile')) return <SmartphoneIcon className="h-8 w-8 mx-auto mb-2 text-text-secondary" />;
    if(lowerKey.includes('computing')) return <LaptopIcon className="h-8 w-8 mx-auto mb-2 text-text-secondary" />;
    if(lowerKey.includes('audio')) return <HeadphonesIcon className="h-8 w-8 mx-auto mb-2 text-text-secondary" />;
    return null;
};


export const AddItemWizard: React.FC<AddItemWizardProps> = ({ mode, onClose, onAddItem }) => {
    const [step, setStep] = useState(0);
    const [selection, setSelection] = useState<Partial<ShoppingItem & ElectronicsItem>>({});

    const STEPS = useMemo(() => {
        if (mode === 'clothing') {
            return [
                { title: 'Select Type', key: 'type' },
                { title: 'Select Item', key: 'item' },
                { title: 'Select Material', key: 'material' },
            ];
        } else {
            return [
                { title: 'Select Category', key: 'category' },
                { title: 'Select Item', key: 'item' },
            ];
        }
    }, [mode]);

    const currentStepConfig = STEPS[step];

    const options = useMemo(() => {
        if (!currentStepConfig) return [];
        
        if (mode === 'clothing') {
            switch (step) {
                case 0: // Type
                    return Object.keys(SHOPPING_DATA.Clothing.types);
                case 1: // Item
                    return Object.keys(SHOPPING_DATA.Clothing.types[selection.type!]?.items || {});
                case 2: // Material
                    return SHOPPING_DATA.Clothing.types[selection.type!]?.items[selection.item!]?.materials || [];
                default:
                    return [];
            }
        } else { // Electronics
            switch (step) {
                case 0: // Category
                    return Object.keys(ELECTRONICS_DATA);
                case 1: // Item
                    return Object.keys(ELECTRONICS_DATA[selection.category!]?.items || {});
                default:
                    return [];
            }
        }
    }, [step, selection, mode, currentStepConfig]);

    const handleSelect = (option: string) => {
        setSelection(prev => ({ ...prev, [currentStepConfig.key]: option }));
    };

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(s => s + 1);
        } else {
            // Last step, confirm and add
            if(mode === 'clothing') {
                onAddItem({ category: 'Clothing', ...selection } as ShoppingItem);
            } else {
                onAddItem(selection as ElectronicsItem);
            }
        }
    };

    const handleBack = () => {
        if (step > 0) {
            // Clear the selection for the current step when going back
            setSelection(prev => {
                const newSelection = {...prev};
                delete newSelection[currentStepConfig.key as keyof typeof newSelection];
                return newSelection;
            });
            setStep(s => s - 1);
        }
    };
    
    const progress = ((step + 1) / STEPS.length) * 100;
    const isSelectionMade = !!selection[currentStepConfig.key as keyof typeof selection];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Header and Progress */}
                <div className="p-6 border-b border-border">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-text">{currentStepConfig.title}</h2>
                        <span className="text-sm font-semibold text-text-secondary">Step {step + 1} of {STEPS.length}</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* Options Grid */}
                <div className="p-6 overflow-y-auto flex-grow">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {options.map(option => (
                            <button 
                                key={option} 
                                onClick={() => handleSelect(option)}
                                className={`p-4 border-2 rounded-lg text-center font-semibold text-text transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${selection[currentStepConfig.key as keyof typeof selection] === option ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
                            >
                                {getIcon(option)}
                                <span>{option}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer and Controls */}
                <div className="p-6 border-t border-border bg-background flex items-center justify-between">
                    <button 
                        onClick={handleBack}
                        disabled={step === 0}
                        className="py-2 px-5 font-semibold text-text-secondary rounded-md hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Back
                    </button>
                    <button 
                        onClick={handleNext}
                        disabled={!isSelectionMade}
                        className="py-2 px-6 font-bold text-white bg-primary rounded-full hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                    >
                        {step === STEPS.length - 1 ? 'Confirm' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};