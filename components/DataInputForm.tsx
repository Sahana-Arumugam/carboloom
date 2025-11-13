import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DailyHabits, TravelEntry, ShoppingItem, TransportMode, ElectronicsItem, HomeApplianceUsage, LogEntry, FoodEntry } from '../types';
import { Tooltip } from './Tooltip';
import { InfoIcon } from './icons/InfoIcon';
import { AddItemWizard } from './AddItemWizard';
import { AddApplianceWizard } from './AddApplianceWizard';
import { EditIcon } from './icons/EditIcon';
import { XIcon } from './icons/XIcon';
import { TshirtIcon, JeansIcon, ShoesIcon, SmartphoneIcon, LaptopIcon, HeadphonesIcon } from './icons/CategoryIcons';
import { TvIcon, FridgeIcon, AcIcon, FanIcon, BulbIcon, WashingMachineIcon, GeyserIcon, MicrowaveIcon } from './icons/ApplianceIcons';
import { SuccessAnimation } from './SuccessAnimation';
import { EMISSION_FACTORS, FOOD_DATA } from '../constants';
import { FoodIcon } from './icons/FoodIcon';


// --- Start of new Transport Icons ---
const WalkingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);
const BicycleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4 2 2 0 000-4zm0 0a2 2 0 110 4 2 2 0 010-4zm0 0H6m6 0h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a2 2 0 100 4 2 2 0 000-4zm0 0a2 2 0 110 4 2 2 0 010-4zm0 0H6m6 0h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const BusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h2m-4-7h14M5 11h14M5 17h14" />
    </svg>
);
const MetroIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4a2 2 0 012-2h14a2 2 0 012 2v4M3 10h18M3 15h18" />
    </svg>
);
const TrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4a2 2 0 012-2h14a2 2 0 012 2v4M5 17h14M5 11h14M17 11V7a2 2 0 00-2-2H9a2 2 0 00-2 2v4m10 0v-4" />
    </svg>
);
const MotorcycleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v4m0 0v4m0-4h4m-4 0H8m4 8a2 2 0 100-4 2 2 0 000 4zm-4 2a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);
const AutoRickshawIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4m16 0a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 012-2m16 0V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0L18 8m-4 4L12 8" />
    </svg>
);
const CabIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v4H4z" />
    </svg>
);
// --- End of new Transport Icons ---

// --- Start of new AddTravelWizard Component ---
interface AddTravelWizardProps {
  onClose: () => void;
  onAddTravel: (travelEntry: Omit<TravelEntry, 'emissions'>) => void;
}

const formatTransportMode = (mode: TransportMode): string => {
    switch(mode) {
        case TransportMode.AutoRickshaw: return "Auto Rickshaw";
        case TransportMode.Motorcycle: return "Motorcycle";
        default: return mode.charAt(0) + mode.slice(1).toLowerCase();
    }
}

const transportModeDetails: Record<TransportMode, { name: string; icon: React.FC<any> }> = {
    [TransportMode.Walking]: { name: formatTransportMode(TransportMode.Walking), icon: WalkingIcon },
    [TransportMode.Bicycle]: { name: formatTransportMode(TransportMode.Bicycle), icon: BicycleIcon },
    [TransportMode.Bus]: { name: formatTransportMode(TransportMode.Bus), icon: BusIcon },
    [TransportMode.Metro]: { name: formatTransportMode(TransportMode.Metro), icon: MetroIcon },
    [TransportMode.Train]: { name: formatTransportMode(TransportMode.Train), icon: TrainIcon },
    [TransportMode.Motorcycle]: { name: formatTransportMode(TransportMode.Motorcycle), icon: MotorcycleIcon },
    [TransportMode.AutoRickshaw]: { name: formatTransportMode(TransportMode.AutoRickshaw), icon: AutoRickshawIcon },
    [TransportMode.Cab]: { name: formatTransportMode(TransportMode.Cab), icon: CabIcon },
};

const AddTravelWizard: React.FC<AddTravelWizardProps> = ({ onClose, onAddTravel }) => {
    const [step, setStep] = useState(0);
    const [selection, setSelection] = useState<Partial<Omit<TravelEntry, 'emissions'>>>({});
    const [customDistance, setCustomDistance] = useState<string>('');

    const STEPS = ['Select Mode of Transport', 'Select Distance (km)'];
    const currentStepConfig = { title: STEPS[step] };

    const handleModeSelect = (mode: TransportMode) => {
        setSelection({ mode });
        setStep(1);
    };

    const handleDistanceSelect = (dist: number) => {
        setSelection(prev => ({ ...prev, distance: dist }));
        setCustomDistance('');
    };

    const handleCustomDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCustomDistance(val);
        const numVal = parseFloat(val);
        if (!isNaN(numVal) && numVal > 0) {
            setSelection(prev => ({ ...prev, distance: numVal }));
        } else {
            setSelection(prev => ({ ...prev, distance: undefined }));
        }
    };
    
    const handleAdd = () => {
        if (selection.mode && selection.distance && selection.distance > 0) {
            onAddTravel(selection as Omit<TravelEntry, 'emissions'>);
        }
    };

    const handleBack = () => {
        setStep(s => s - 1);
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
                    {step === 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {Object.values(TransportMode).map(mode => {
                                const details = transportModeDetails[mode];
                                return (
                                    <button 
                                        key={mode} 
                                        onClick={() => handleModeSelect(mode)}
                                        className="p-4 border-2 rounded-lg text-center font-semibold text-text transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary border-border bg-background"
                                    >
                                        <details.icon className="h-8 w-8 mx-auto mb-2 text-text-secondary" />
                                        <span>{details.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    {step === 1 && (
                        <div className="flex flex-col items-center justify-center">
                            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center mb-8">
                                <div className="absolute w-full h-full border-4 border-border rounded-full"></div>
                                <div className="absolute w-40 h-40 sm:w-48 sm:h-48 bg-background rounded-full flex items-center justify-center flex-col shadow-inner">
                                    <span className="text-5xl font-bold text-primary">{selection.distance || 0}</span>
                                    <span className="text-lg text-text-secondary">km</span>
                                </div>
                                {Array.from({ length: 12 }, (_, i) => {
                                    const value = i + 1;
                                    const angle = (i / 12) * 2 * Math.PI - (Math.PI / 2); // Start from top
                                    const radius = 128; // sm: 144
                                    const x = 144 + radius * Math.cos(angle);
                                    const y = 144 + radius * Math.sin(angle);
                                    const isSelected = selection.distance === value && customDistance === '';

                                    return (
                                        <button
                                            key={value}
                                            onClick={() => handleDistanceSelect(value)}
                                            style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)' }}
                                            className={`absolute h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary ${
                                                isSelected ? 'bg-primary text-white shadow-lg scale-110' : 'bg-card text-text shadow-md'
                                            }`}
                                        >
                                            {value}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="w-full max-w-xs">
                                <label htmlFor="custom-distance" className="block text-center text-sm font-medium text-text-secondary mb-2">Or enter a custom distance</label>
                                <input
                                    type="number"
                                    id="custom-distance"
                                    value={customDistance}
                                    onChange={handleCustomDistanceChange}
                                    placeholder="e.g., 15.5"
                                    min="0"
                                    step="0.1"
                                    className="w-full text-center p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text"
                                    aria-label="Custom trip distance in km"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-border bg-background flex items-center justify-between">
                    <button 
                        onClick={handleBack}
                        disabled={step === 0}
                        className="py-2 px-5 font-semibold text-text-secondary rounded-md hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Back
                    </button>
                    {step === 1 && (
                        <button 
                            onClick={handleAdd}
                            disabled={!selection.distance || selection.distance <= 0}
                            className="py-2 px-6 font-bold text-white bg-primary rounded-full hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                        >
                            Add Trip
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
// --- End of new AddTravelWizard Component ---


interface EditTripModalProps {
  trip: TravelEntry;
  onSave: (updatedTrip: Omit<TravelEntry, 'emissions'>) => void;
  onClose: () => void;
}

const EditTripModal: React.FC<EditTripModalProps> = ({ trip, onSave, onClose }) => {
    const [distance, setDistance] = useState(trip.distance);
    const [mode, setMode] = useState(trip.mode);

    const handleSave = () => {
        if (distance > 0) {
            onSave({ distance, mode });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-card rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-text mb-4">Edit Trip</h3>
                
                <div className="mb-4">
                    <label htmlFor="edit-distance" className="block text-sm font-medium text-text-secondary mb-1">Distance (km)</label>
                    <input
                        type="number"
                        id="edit-distance"
                        value={distance}
                        onChange={(e) => setDistance(Number(e.target.value))}
                        className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text"
                        aria-label="Trip distance in km"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="edit-mode" className="block text-sm font-medium text-text-secondary mb-1">Mode of Transport</label>
                    <select
                        id="edit-mode"
                        value={mode}
                        onChange={(e) => setMode(e.target.value as TransportMode)}
                        className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text"
                    >
                        {Object.values(TransportMode).map(m => (
                            <option key={m} value={m}>{formatTransportMode(m)}</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="py-2 px-4 font-semibold text-text-secondary rounded-md hover:bg-border transition-colors">Cancel</button>
                    <button onClick={handleSave} className="py-2 px-5 font-bold text-white bg-primary rounded-md hover:bg-primary-dark transition-colors">Save Changes</button>
                </div>
            </div>
        </div>
    );
};


const FormSection: React.FC<{ title: string; children: React.ReactNode; tooltipText: string; }> = ({ title, children, tooltipText }) => (
    <div className="mb-8 p-4 border border-border rounded-lg bg-card/50">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark flex items-center">
            <span>{title}</span>
            <Tooltip text={tooltipText}>
                <InfoIcon className="h-4 w-4 ml-2 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
        </h3>
        <div>{children}</div>
    </div>
);

const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getYesterdayDateString = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = (yesterday.getMonth() + 1).toString().padStart(2, '0');
    const day = yesterday.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// --- Start of new helper components for logged data ---
interface LoggedItemCardProps {
  icon: React.ReactNode;
  primaryText: string;
  secondaryText?: string;
  onEdit?: () => void;
  onRemove: () => void;
}

const LoggedItemCard: React.FC<LoggedItemCardProps> = ({ icon, primaryText, secondaryText, onEdit, onRemove }) => {
  return (
    <div className="flex items-center justify-between bg-background p-3 rounded-lg border border-border transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="text-primary flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-text truncate">{primaryText}</p>
          {secondaryText && <p className="text-sm text-text-secondary truncate">{secondaryText}</p>}
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
        {onEdit && (
          <button type="button" onClick={onEdit} className="p-2 text-blue-500 rounded-full hover:bg-blue-100 transition-colors" aria-label="Edit item">
            <EditIcon className="h-5 w-5" />
          </button>
        )}
        <button type="button" onClick={onRemove} className="p-2 text-red-500 rounded-full hover:bg-red-100 transition-colors" aria-label="Remove item">
          <XIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const getShoppingIcon = (item: ShoppingItem) => {
    const iconProps = { className: "h-6 w-6" };
    const type = item.type.toLowerCase();
    if (type.includes('topwear')) return <TshirtIcon {...iconProps} />;
    if (type.includes('bottomwear')) return <JeansIcon {...iconProps} />;
    if (type.includes('footwear')) return <ShoesIcon {...iconProps} />;
    return <TshirtIcon {...iconProps} />;
};

const getElectronicsIcon = (item: ElectronicsItem) => {
    const iconProps = { className: "h-6 w-6" };
    const category = item.category.toLowerCase();
    if (category.includes('mobile')) return <SmartphoneIcon {...iconProps} />;
    if (category.includes('computing')) return <LaptopIcon {...iconProps} />;
    if (category.includes('audio')) return <HeadphonesIcon {...iconProps} />;
    return <SmartphoneIcon {...iconProps} />;
};

const getHomeIcon = (item: HomeApplianceUsage) => {
    const iconProps = { className: "h-6 w-6" };
    const name = item.name.toLowerCase();
    if (name.includes('television')) return <TvIcon {...iconProps} />;
    if (name.includes('refrigerator')) return <FridgeIcon {...iconProps} />;
    if (name.includes('air conditioner')) return <AcIcon {...iconProps} />;
    if (name.includes('ceiling fan')) return <FanIcon {...iconProps} />;
    if (name.includes('led bulb')) return <BulbIcon {...iconProps} />;
    if (name.includes('washing machine')) return <WashingMachineIcon {...iconProps} />;
    if (name.includes('water heater')) return <GeyserIcon {...iconProps} />;
    if (name.includes('microwave')) return <MicrowaveIcon {...iconProps} />;
    if (name.includes('laptop')) return <LaptopIcon {...iconProps} />;
    return <BulbIcon {...iconProps} />;
};
// --- End of new helper components ---


// Moved types outside of component to fix reference errors and improve clarity
type WizardMode = 'clothing' | 'electronics';

interface DataInputFormProps {
  onSubmit: (newEntry: { date: string, habits: DailyHabits }) => void;
  logEntries: LogEntry[];
}

// Moved constant outside of component for performance and to avoid re-creation on every render
const initialHabits: DailyHabits = {
  travel: [],
  shopping: [],
  electronics: [],
  home: [],
  food: [],
};

export const DataInputForm: React.FC<DataInputFormProps> = ({ onSubmit, logEntries }) => {
  const [date, setDate] = useState(getTodayDateString());
  const [habits, setHabits] = useState<DailyHabits>(initialHabits);

  const todayString = useMemo(() => getTodayDateString(), []);
  const yesterdayString = useMemo(() => getYesterdayDateString(), []);
  const isCustomDate = date !== todayString && date !== yesterdayString;


  useEffect(() => {
    const existingEntry = logEntries.find(entry => entry.date === date);
    if (existingEntry) {
      setHabits(JSON.parse(JSON.stringify(existingEntry.habits)));
    } else {
      setHabits(initialHabits);
    }
  }, [date, logEntries]);

  // --- Item Wizard State ---
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardMode, setWizardMode] = useState<WizardMode | null>(null);
  const [isApplianceWizardOpen, setIsApplianceWizardOpen] = useState(false);
  const [isTravelWizardOpen, setIsTravelWizardOpen] = useState(false);

  // --- Editing State ---
  const [editingTripIndex, setEditingTripIndex] = useState<number | null>(null);

  // --- Visual Feedback State ---
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimeoutRef = useRef<number | null>(null);
  
  const triggerSuccess = () => {
    if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
    }
    setShowSuccess(true);
    successTimeoutRef.current = window.setTimeout(() => {
        setShowSuccess(false);
    }, 1500);
  };

  const handleAddTravel = (travelEntry: Omit<TravelEntry, 'emissions'>) => {
    const factor = EMISSION_FACTORS.travel[travelEntry.mode] || 0;
    const emissions = parseFloat((travelEntry.distance * factor).toFixed(2));
    setHabits(prev => ({
        ...prev,
        travel: [...prev.travel, { ...travelEntry, emissions }]
    }));
    setIsTravelWizardOpen(false);
  };

  const handleSaveTrip = (updatedTrip: Omit<TravelEntry, 'emissions'>) => {
    if (editingTripIndex !== null) {
      const factor = EMISSION_FACTORS.travel[updatedTrip.mode] || 0;
      const emissions = parseFloat((updatedTrip.distance * factor).toFixed(2));
      const newTravelHabits = [...habits.travel];
      newTravelHabits[editingTripIndex] = { ...updatedTrip, emissions };
      setHabits(prev => ({ ...prev, travel: newTravelHabits }));
      setEditingTripIndex(null);
    }
  };
  
  const openWizard = (mode: WizardMode) => {
      setWizardMode(mode);
      setIsWizardOpen(true);
  }
  
  const handleAddItem = (item: ShoppingItem | ElectronicsItem) => {
      if(wizardMode === 'clothing') {
          setHabits(prev => ({...prev, shopping: [...prev.shopping, item as ShoppingItem]}));
      } else if (wizardMode === 'electronics') {
          setHabits(prev => ({...prev, electronics: [...prev.electronics, item as ElectronicsItem]}));
      }
      setIsWizardOpen(false);
  }

  const handleAddAppliance = (appliance: HomeApplianceUsage) => {
    setHabits(prev => ({...prev, home: [...prev.home, appliance]}));
    setIsApplianceWizardOpen(false);
  };

  const handleFoodServingsChange = (category: FoodEntry['category'], newServings: number) => {
    setHabits(prev => {
        const existingEntryIndex = prev.food.findIndex(f => f.category === category);
        const newFoodHabits = [...prev.food];

        if (existingEntryIndex > -1) {
            if (newServings > 0) {
                newFoodHabits[existingEntryIndex] = { ...newFoodHabits[existingEntryIndex], servings: newServings };
            } else {
                newFoodHabits.splice(existingEntryIndex, 1);
            }
        } else if (newServings > 0) {
            newFoodHabits.push({ category, servings: newServings });
        }

        return { ...prev, food: newFoodHabits };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSuccess();
    setTimeout(() => {
      onSubmit({ date, habits });
    }, 1500);
  };
  
  const currentEditingTrip = editingTripIndex !== null ? habits.travel[editingTripIndex] : null;

  return (
    <>
      <SuccessAnimation show={showSuccess} />
      {isWizardOpen && wizardMode && (
          <AddItemWizard 
              mode={wizardMode}
              onClose={() => setIsWizardOpen(false)}
              onAddItem={handleAddItem}
          />
      )}
      {isApplianceWizardOpen && (
        <AddApplianceWizard
          onClose={() => setIsApplianceWizardOpen(false)}
          onAddAppliance={handleAddAppliance}
        />
      )}
      {isTravelWizardOpen && (
          <AddTravelWizard
              onClose={() => setIsTravelWizardOpen(false)}
              onAddTravel={handleAddTravel}
          />
      )}
      {currentEditingTrip && (
        <EditTripModal 
            trip={currentEditingTrip}
            onSave={handleSaveTrip}
            onClose={() => setEditingTripIndex(null)}
        />
      )}
      <div className="bg-card p-4 sm:p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-text mb-6">Weave Your Daily Thread</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
              <label className="block mb-2 text-lg font-semibold text-text">Date</label>
              <div className="flex flex-wrap items-center gap-2 p-1 bg-background rounded-full border border-border w-full sm:w-auto">
                  <button
                      type="button"
                      onClick={() => setDate(yesterdayString)}
                      className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${date === yesterdayString ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:bg-border'}`}
                  >
                      Yesterday
                  </button>
                  <button
                      type="button"
                      onClick={() => setDate(todayString)}
                      className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${date === todayString ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:bg-border'}`}
                  >
                      Today
                  </button>
                  <div className="relative flex-1 sm:flex-initial">
                      <button
                          type="button"
                          className={`w-full px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 text-center ${isCustomDate ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:bg-border'}`}
                          tabIndex={-1} 
                      >
                           {isCustomDate ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Custom'}
                      </button>
                      <input 
                          type="date"
                          id="log-date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          aria-label="Select a custom date"
                      />
                  </div>
              </div>
          </div>

          <FormSection title="🚌 Daily Travel" tooltipText="Log your daily commute and other trips. Each mode of transport has a different carbon footprint.">
            <button
                type="button"
                onClick={() => setIsTravelWizardOpen(true)}
                className="w-full bg-primary-light hover:bg-primary text-white font-semibold py-2 px-4 rounded-md transition duration-300 mb-6"
            >
                Add Trip
            </button>

            <h4 className="font-semibold text-text-secondary text-base mb-3">Logged Trips</h4>
            <div className="space-y-3">
              {habits.travel.map((trip, index) => {
                const details = transportModeDetails[trip.mode];
                const Icon = details.icon;
                return (
                  <LoggedItemCard
                    key={index}
                    icon={<Icon className="h-6 w-6" />}
                    primaryText={details.name}
                    secondaryText={`${trip.distance} km · ${trip.emissions?.toFixed(2) ?? '0.00'} kg CO₂e`}
                    onEdit={() => setEditingTripIndex(index)}
                    onRemove={() => setHabits(prev => ({...prev, travel: prev.travel.filter((_, i) => i !== index)}))}
                  />
                )
              })}
              {habits.travel.length === 0 && <p className="text-sm text-text-secondary text-center py-4">No trips logged for this day.</p>}
            </div>
          </FormSection>

           <FormSection title="🍽️ Daily Diet" tooltipText="Log your approximate number of servings for each food category today. A serving is about 100g.">
            <div className="space-y-4">
                {Object.keys(FOOD_DATA).map(category => {
                    const currentServings = habits.food.find(f => f.category === category)?.servings || 0;
                    return (
                        <div key={category} className="flex items-center justify-between bg-background p-3 rounded-lg border border-border">
                            <span className="font-semibold text-text">{category}</span>
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={() => handleFoodServingsChange(category as FoodEntry['category'], Math.max(0, currentServings - 1))} className="w-8 h-8 rounded-full bg-border text-text font-bold hover:bg-primary-light hover:text-white transition-colors">-</button>
                                <input 
                                    type="number" 
                                    value={currentServings}
                                    onChange={(e) => handleFoodServingsChange(category as FoodEntry['category'], parseInt(e.target.value, 10) || 0)}
                                    className="w-12 text-center font-bold bg-transparent"
                                    aria-label={`${category} servings`}
                                />
                                <button type="button" onClick={() => handleFoodServingsChange(category as FoodEntry['category'], currentServings + 1)} className="w-8 h-8 rounded-full bg-border text-text font-bold hover:bg-primary-light hover:text-white transition-colors">+</button>
                            </div>
                        </div>
                    )
                })}
            </div>
          </FormSection>

          <FormSection title="🛍️ Daily Shopping (Clothing)" tooltipText="Log any clothing items you purchased today. The footprint is calculated based on the item's material.">
            <button type="button" onClick={() => openWizard('clothing')} className="w-full bg-primary-light hover:bg-primary text-white font-semibold py-2 px-4 rounded-md transition duration-300 mb-6">Add Clothing Item</button>
            <h4 className="font-semibold text-text-secondary text-base mb-3">Logged Items</h4>
            <div className="space-y-3">
                  {habits.shopping.map((item, index) => (
                    <LoggedItemCard
                      key={index}
                      icon={getShoppingIcon(item)}
                      primaryText={item.item}
                      secondaryText={item.material}
                      onRemove={() => setHabits(prev => ({...prev, shopping: prev.shopping.filter((_, i) => i !== index)}))}
                    />
                ))}
                {habits.shopping.length === 0 && <p className="text-sm text-text-secondary text-center py-4">No clothing items logged for this day.</p>}
            </div>
          </FormSection>

          <FormSection title="🔌 Electronics Purchases" tooltipText="Log any new electronics. The footprint is a lifecycle estimate including manufacturing and disposal.">
            <button type="button" onClick={() => openWizard('electronics')} className="w-full bg-primary-light hover:bg-primary text-white font-semibold py-2 px-4 rounded-md transition duration-300 mb-6">Add Electronic Item</button>
             <h4 className="font-semibold text-text-secondary text-base mb-3">Logged Items</h4>
              <div className="space-y-3">
                  {habits.electronics.map((item, index) => (
                    <LoggedItemCard
                      key={index}
                      icon={getElectronicsIcon(item)}
                      primaryText={item.item}
                      secondaryText={item.category}
                      onRemove={() => setHabits(prev => ({...prev, electronics: prev.electronics.filter((_, i) => i !== index)}))}
                    />
                ))}
                {habits.electronics.length === 0 && <p className="text-sm text-text-secondary text-center py-4">No electronics logged for this day.</p>}
            </div>
          </FormSection>

          <FormSection title="🏠 Home & Energy" tooltipText="Log daily usage of home appliances. Footprint is based on average power consumption and the Indian electricity grid's carbon intensity.">
                <button type="button" onClick={() => setIsApplianceWizardOpen(true)} className="w-full bg-primary-light hover:bg-primary text-white font-semibold py-2 px-4 rounded-md transition duration-300 mb-6">Add Appliance Usage</button>
                <h4 className="font-semibold text-text-secondary text-base mb-3">Logged Usage</h4>
                <div className="space-y-3">
                    {habits.home.map((item, index) => (
                      <LoggedItemCard
                        key={index}
                        icon={getHomeIcon(item)}
                        primaryText={item.name}
                        secondaryText={`${item.quantity > 1 ? `${item.quantity}x, ` : ''}${item.hours} hrs`}
                        onRemove={() => setHabits(prev => ({...prev, home: prev.home.filter((_, i) => i !== index)}))}
                      />
                ))}
                {habits.home.length === 0 && <p className="text-sm text-text-secondary text-center py-4">No appliance usage logged for this day.</p>}
                </div>
            </FormSection>
          
          <div className="text-center mt-8">
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 duration-300 shadow-md">
              Save Daily Log
            </button>
          </div>
        </form>
      </div>
    </>
  );
};