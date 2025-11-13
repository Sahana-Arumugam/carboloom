import React, { useState, useMemo } from 'react';
import { HomeApplianceUsage } from '../types';
import { APPLIANCE_DATA } from '../constants';
import { TvIcon, FridgeIcon, AcIcon, FanIcon, BulbIcon, WashingMachineIcon, GeyserIcon, MicrowaveIcon, LaptopIcon } from './icons/ApplianceIcons';

interface AddApplianceWizardProps {
  onClose: () => void;
  onAddAppliance: (appliance: HomeApplianceUsage) => void;
}

const HOUR_OPTIONS: Record<string, number> = {
  '< 1 hr': 0.5,
  '1-2 hrs': 1.5,
  '2-4 hrs': 3,
  '4-8 hrs': 6,
  '8-12 hrs': 10,
  '12+ hrs': 18,
};

const QUANTITY_OPTIONS = [1, 2, 3, 4, 5];

const getIcon = (key: string) => {
    const lowerKey = key.toLowerCase();
    const iconProps = { className: "h-8 w-8 mx-auto mb-2 text-text-secondary" };
    if (lowerKey.includes('television')) return <TvIcon {...iconProps} />;
    if (lowerKey.includes('refrigerator')) return <FridgeIcon {...iconProps} />;
    if (lowerKey.includes('air conditioner')) return <AcIcon {...iconProps} />;
    if (lowerKey.includes('ceiling fan')) return <FanIcon {...iconProps} />;
    if (lowerKey.includes('led bulb')) return <BulbIcon {...iconProps} />;
    if (lowerKey.includes('washing machine')) return <WashingMachineIcon {...iconProps} />;
    if (lowerKey.includes('water heater')) return <GeyserIcon {...iconProps} />;
    if (lowerKey.includes('microwave')) return <MicrowaveIcon {...iconProps} />;
    if (lowerKey.includes('laptop')) return <LaptopIcon {...iconProps} />;
    return null;
};

export const AddApplianceWizard: React.FC<AddApplianceWizardProps> = ({ onClose, onAddAppliance }) => {
    const [step, setStep] = useState(0);
    const [selection, setSelection] = useState<Partial<HomeApplianceUsage & { hourLabel: string }>>({});

    const STEPS = useMemo(() => {
        const baseSteps = ['Select Appliance', 'Select Hours'];
        const requiresQuantity = selection.name ? APPLIANCE_DATA[selection.name]?.requiresQuantity : false;
        if (requiresQuantity) {
            baseSteps.push('Select Quantity');
        }
        return baseSteps;
    }, [selection.name]);

    const currentStepConfig = { title: STEPS[step] };

    const options = useMemo(() => {
        switch (step) {
            case 0: // Appliance
                return Object.keys(APPLIANCE_DATA);
            case 1: // Hours
                return Object.keys(HOUR_OPTIONS);
            case 2: // Quantity
                return QUANTITY_OPTIONS.map(String);
            default:
                return [];
        }
    }, [step]);
    
    const handleSelect = (option: string) => {
        switch (step) {
            case 0:
                setSelection({ name: option });
                break;
            case 1:
                setSelection(prev => ({ ...prev, hourLabel: option, hours: HOUR_OPTIONS[option] }));
                break;
            case 2:
                setSelection(prev => ({ ...prev, quantity: Number(option) }));
                break;
        }
    };

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(s => s + 1);
        } else {
            const finalSelection = {
                name: selection.name!,
                hours: selection.hours!,
                quantity: selection.quantity || 1
            };
            onAddAppliance(finalSelection);
        }
    };
    
    const handleBack = () => {
        if (step > 0) {
            const newStep = step - 1;
            // Clear selections from the current step and subsequent steps
            if (newStep === 0) setSelection({}); // back to appliance selection
            if (newStep === 1) setSelection(prev => ({ name: prev.name })); // back to hour selection
            setStep(newStep);
        }
    };

    const isSelectionMade = () => {
        switch (step) {
            case 0: return !!selection.name;
            case 1: return !!selection.hours;
            case 2: return !!selection.quantity;
            default: return false;
        }
    };

    const getSelectedValue = () => {
        switch (step) {
            case 0: return selection.name;
            case 1: return selection.hourLabel;
            case 2: return String(selection.quantity);
            default: return undefined;
        }
    };

    const progress = ((step + 1) / STEPS.length) * 100;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-border">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-text">{currentStepConfig.title}</h2>
                        <span className="text-sm font-semibold text-text-secondary">Step {step + 1} of {STEPS.length}</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-grow">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {options.map(option => (
                            <button
                                key={option}
                                onClick={() => handleSelect(option)}
                                className={`p-4 border-2 rounded-lg text-center font-semibold text-text transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${getSelectedValue() === option ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
                            >
                                {step === 0 && getIcon(option)}
                                <span>{option}</span>
                            </button>
                        ))}
                    </div>
                </div>

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
                        disabled={!isSelectionMade()}
                        className="py-2 px-6 font-bold text-white bg-primary rounded-full hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                    >
                        {step === STEPS.length - 1 ? 'Add Appliance' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};