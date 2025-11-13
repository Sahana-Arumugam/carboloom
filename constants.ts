import { TransportMode, ShoppingItem, ElectronicsItem, Badge, Challenge, Country, HomeApplianceUsage, FoodEntry } from './types';

// Emission factors are simplified estimates for this gamified app.
// Units are in kg CO2e per unit (km).
export const EMISSION_FACTORS = {
  // Travel (kg CO2e per km)
  travel: {
    [TransportMode.Walking]: 0,
    [TransportMode.Bicycle]: 0,
    [TransportMode.Bus]: 0.10,      // Average city bus
    [TransportMode.Metro]: 0.03,    // City metro systems
    [TransportMode.Train]: 0.04,    // National rail
    [TransportMode.Motorcycle]: 0.11,
    [TransportMode.AutoRickshaw]: 0.06, // Assuming CNG auto
    [TransportMode.Cab]: 0.15,      // e.g., Uber/Ola
  }
};

// Data for shopping dropdowns and footprint calculation
// Footprints are lifecycle estimates in kg CO2e per item.
export const SHOPPING_DATA = {
    'Clothing': {
        types: {
            'Topwear': {
                items: {
                    'T-shirt': { 
                        materials: ['Cotton', 'Organic Cotton', 'Polyester', 'Recycled Polyester', 'Linen', 'Hemp', 'Wool', 'Bamboo Viscose', 'Modal', 'Lyocell', 'Viscose', 'Rayon', 'Recycled Cotton', 'Spandex Blend'], 
                        footprint: { 'Cotton': 2.1, 'Organic Cotton': 1.5, 'Polyester': 5.5, 'Recycled Polyester': 3.0, 'Linen': 1.5, 'Hemp': 1.2, 'Wool': 7.0, 'Bamboo Viscose': 2.5, 'Modal': 2.8, 'Lyocell': 2.7, 'Viscose': 3.0, 'Rayon': 2.9, 'Recycled Cotton': 1.0, 'Spandex Blend': 2.5 } 
                    },
                    'Shirt': { 
                        materials: ['Cotton', 'Organic Cotton', 'Polyester', 'Recycled Polyester', 'Linen', 'Silk', 'Rayon', 'Tencel', 'Viscose', 'Bamboo Viscose', 'Modal'], 
                        footprint: { 'Cotton': 2.5, 'Organic Cotton': 1.8, 'Polyester': 6.0, 'Recycled Polyester': 3.5, 'Linen': 1.8, 'Silk': 40.0, 'Rayon': 3.0, 'Tencel': 3.2, 'Viscose': 3.5, 'Bamboo Viscose': 3.0, 'Modal': 3.1 } 
                    },
                    'Kurta': { 
                        materials: ['Cotton', 'Organic Cotton', 'Linen', 'Silk', 'Rayon', 'Viscose'], 
                        footprint: { 'Cotton': 2.8, 'Organic Cotton': 2.0, 'Linen': 2.0, 'Silk': 42.0, 'Rayon': 3.2, 'Viscose': 3.5 } 
                    },
                    'Sweater': { 
                        materials: ['Cotton', 'Wool', 'Recycled Wool', 'Cashmere', 'Polyester', 'Acrylic', 'Alpaca', 'Mohair', 'Felt', 'Cotton-Poly Blend'], 
                        footprint: { 'Cotton': 4.0, 'Wool': 15.0, 'Recycled Wool': 6.0, 'Cashmere': 60.0, 'Polyester': 9.0, 'Acrylic': 12.0, 'Alpaca': 55.0, 'Mohair': 50.0, 'Felt': 16.0, 'Cotton-Poly Blend': 7.0 } 
                    },
                    'Jacket': { 
                        materials: ['Down', 'Faux Fur', 'Recycled Polyester', 'Leather', 'Denim', 'Wool', 'Felt', 'Cordura', 'Gore-Tex (synthetic)'], 
                        footprint: { 'Down': 50.0, 'Faux Fur': 25.0, 'Recycled Polyester': 10.0, 'Leather': 60.0, 'Denim': 22.0, 'Wool': 45.0, 'Felt': 18.0, 'Cordura': 15.0, 'Gore-Tex (synthetic)': 30.0 } 
                    },
                }
            },
            'Bottomwear': {
                items: {
                    'Jeans': { 
                        materials: ['Cotton', 'Organic Cotton', 'Cotton-Polyester Blend', 'Hemp-Cotton Blend', 'Recycled Cotton', 'Lycra/Spandex Blend', 'Tencel Blend'], 
                        footprint: { 'Cotton': 20.0, 'Organic Cotton': 14.0, 'Cotton-Polyester Blend': 25.0, 'Hemp-Cotton Blend': 15.0, 'Recycled Cotton': 5.0, 'Lycra/Spandex Blend': 22.0, 'Tencel Blend': 16.0 } 
                    },
                    'Trousers': { 
                        materials: ['Cotton', 'Polyester', 'Recycled Polyester', 'Wool', 'Linen', 'Corduroy', 'Viscose', 'Tencel', 'Rayon', 'Spandex Blend'], 
                        footprint: { 'Cotton': 7.0, 'Polyester': 12.0, 'Recycled Polyester': 8.0, 'Wool': 20.0, 'Linen': 5.0, 'Corduroy': 7.5, 'Viscose': 8.0, 'Tencel': 6.0, 'Rayon': 7.0, 'Spandex Blend': 8.5 } 
                    },
                    'Pajama': {
                        materials: ['Cotton', 'Linen', 'Silk'],
                        footprint: { 'Cotton': 4.0, 'Linen': 2.5, 'Silk': 30.0 }
                    },
                    'Shorts': { 
                        materials: ['Cotton', 'Linen', 'Polyester', 'Recycled Polyester', 'Spandex', 'Denim', 'Hemp', 'Tencel'], 
                        footprint: { 'Cotton': 3.0, 'Linen': 2.0, 'Polyester': 6.0, 'Recycled Polyester': 4.5, 'Spandex': 4.0, 'Denim': 7.0, 'Hemp': 1.8, 'Tencel': 2.5 } 
                    },
                }
            },
            'Footwear': {
                items: {
                    'Sneakers': { 
                        materials: ['Canvas', 'Leather', 'Suede', 'Recycled Plastic', 'Synthetic Leather', 'Faux Leather', 'Hemp', 'Rubber', 'Recycled Rubber', 'Recycled Cotton', 'Algae Foam'], 
                        footprint: { 'Canvas': 8.0, 'Leather': 20.0, 'Suede': 22.0, 'Recycled Plastic': 6.0, 'Synthetic Leather': 14.0, 'Faux Leather': 14.0, 'Hemp': 5.0, 'Rubber': 10.0, 'Recycled Rubber': 6.0, 'Recycled Cotton': 4.0, 'Algae Foam': 3.0 } 
                    },
                    'Sandals': { 
                        materials: ['Leather', 'Rubber', 'Cork', 'Synthetic', 'Faux Leather', 'EVA Foam', 'Hemp', 'Recycled Plastic'], 
                        footprint: { 'Leather': 10.0, 'Rubber': 5.0, 'Cork': 2.0, 'Synthetic': 7.0, 'Faux Leather': 7.0, 'EVA Foam': 4.0, 'Hemp': 2.5, 'Recycled Plastic': 4.5 } 
                    },
                    'Chappals': {
                        materials: ['Leather', 'Rubber', 'Synthetic'],
                        footprint: { 'Leather': 9.0, 'Rubber': 4.5, 'Synthetic': 6.0 }
                    },
                    'Boots': { 
                        materials: ['Leather', 'Suede', 'Synthetic Leather', 'Rubber', 'Recycled Rubber sole', 'Gore-Tex', 'Faux Fur lining'], 
                        footprint: { 'Leather': 70.0, 'Suede': 75.0, 'Synthetic Leather': 35.0, 'Rubber': 25.0, 'Recycled Rubber sole': 20.0, 'Gore-Tex': 40.0, 'Faux Fur lining': 38.0 } 
                    },
                }
            }
        }
    }
};

export const ELECTRONICS_DATA = {
    'Mobile Devices': {
        items: { 'Smartphone': 70, 'Tablet': 130, 'Smartwatch': 25 }
    },
    'Computing': {
        items: { 'Laptop': 250, 'Desktop PC': 450, 'Monitor': 100 }
    },
    'Audio': {
        items: { 'Headphones (Over-ear)': 30, 'Earbuds (Wireless)': 15, 'Bluetooth Speaker': 20 }
    },
    'Home Entertainment': {
        items: { 'Television (55-inch LED)': 500, 'Gaming Console': 80 }
    },
    'Accessories': {
        items: { 'Charger & Cable': 5, 'Power Bank': 12 }
    }
};

// Diet Data
// Footprints are estimates in kg CO2e per serving.
export const FOOD_DATA: Record<string, { footprint: number }> = {
    'Red Meat': { footprint: 2.5 }, // e.g., 100g beef/mutton
    'Poultry': { footprint: 0.7 },
    'Fish': { footprint: 0.6 },
    'Dairy': { footprint: 0.5 }, // e.g., glass of milk, serving of cheese/paneer
    'Plant-based Protein': { footprint: 0.1 }, // e.g., lentils, tofu
};

// Home Appliance Data
// Power ratings are average estimates in Watts.
// India's grid emission factor is ~0.71 kg CO2e/kWh as of 2022-23 CEA reports.
export const APPLIANCE_DATA: Record<string, { power_watt: number, requiresQuantity: boolean }> = {
    'Television (LED)': { power_watt: 80, requiresQuantity: false },
    'Refrigerator': { power_watt: 100, requiresQuantity: false }, // Based on compressor run-time
    'Air Conditioner (1.5 Ton)': { power_watt: 1500, requiresQuantity: false },
    'Ceiling Fan': { power_watt: 75, requiresQuantity: true },
    'LED Bulb': { power_watt: 9, requiresQuantity: true },
    'Washing Machine': { power_watt: 500, requiresQuantity: false }, // Per hour of use
    'Water Heater (Geyser)': { power_watt: 2000, requiresQuantity: false }, // Per hour of use
    'Microwave': { power_watt: 1200, requiresQuantity: false },
    'Laptop': { power_watt: 65, requiresQuantity: false },
};

export const INDIA_GRID_EMISSION_FACTOR = 0.71; // kg CO2e per kWh


export const getShoppingFootprint = (item: ShoppingItem): number => {
    try {
        const footprint = SHOPPING_DATA[item.category]?.types[item.type]?.items[item.item]?.footprint[item.material];
        return footprint || 0;
    } catch (e) {
        console.error("Could not calculate shopping footprint for:", item);
        return 0;
    }
};

export const getElectronicsFootprint = (item: ElectronicsItem): number => {
    try {
        const footprint = ELECTRONICS_DATA[item.category]?.items[item.item];
        return footprint || 0;
    } catch (e) {
        console.error("Could not calculate electronics footprint for:", item);
        return 0;
    }
};

export const getHomeFootprint = (item: HomeApplianceUsage, emissionFactor: number): number => {
    try {
        const appliance = APPLIANCE_DATA[item.name];
        if (!appliance) return 0;
        
        const power_kw = appliance.power_watt / 1000;
        const energy_kwh = power_kw * item.hours * item.quantity;
        return energy_kwh * emissionFactor;
    } catch (e) {
        console.error("Could not calculate home footprint for:", item);
        return 0;
    }
};

export const getFoodFootprint = (item: FoodEntry): number => {
    try {
        const foodItem = FOOD_DATA[item.category];
        if (!foodItem) return 0;
        return item.servings * foodItem.footprint;
    } catch (e) {
        console.error("Could not calculate food footprint for:", item);
        return 0;
    }
};

export const BADGE_DEFINITIONS: Record<string, Badge> = {
    'first_log': { id: 'first_log', name: 'Eco Starter', description: 'Logged your first activity!', icon: '🌱' },
    'consistent_logger_7': { id: 'consistent_logger_7', name: 'Habit Builder', description: 'Logged habits on 7 different days.', icon: '🗓️' },
    'commuter_hero': { id: 'commuter_hero', name: 'Commuter Hero', description: 'Traveled over 50km using public transport (Bus/Train).', icon: '🚌' },
    'pedal_power': { id: 'pedal_power', name: 'Pedal Power', description: 'Cycled for more than 20km.', icon: '🚲' },
    'eco_shopper': { id: 'eco_shopper', name: 'Eco Shopper', description: 'Purchased 5 items made from sustainable materials like organic or recycled.', icon: '♻️' },
    'low_carbon_day': { id: 'low_carbon_day', name: 'Carbon Conscious', description: 'Achieved a "Low Carbon Day" (under 5kg CO2e)!', icon: '🍃' },
    'streak_master_5': { id: 'streak_master_5', name: 'Streak Master', description: 'Completed the 5-day logging streak challenge!', icon: '🏅' },
    'quiz_master': { id: 'quiz_master', name: 'Eco Scholar', description: 'Completed your first sustainability quiz!', icon: '🎓' },
};

export const CHALLENGE_DEFINITIONS: Record<string, Challenge> = {
  'logging_streak_5': {
    id: 'logging_streak_5',
    name: 'Logging Streak',
    description: 'Log your habits for 5 consecutive days to earn a big bonus!',
    icon: '🔥',
    goal: 5,
    unit: 'days',
    type: 'streak',
    reward: 100
  },
  'low_carbon_day_streak_3': {
    id: 'low_carbon_day_streak_3',
    name: 'Low Carbon Streak',
    description: 'Keep your daily footprint under 5kg for 3 days in a row.',
    icon: '🌿',
    goal: 3,
    unit: 'days',
    type: 'streak',
    reward: 75
  },
  'green_commute_streak_3': {
    id: 'green_commute_streak_3',
    name: 'Green Commute Streak',
    description: 'Use walking or cycling for your commute for 3 consecutive days.',
    icon: '🚴',
    goal: 3,
    unit: 'days',
    type: 'streak',
    reward: 60
  },
  'green_commute_10': {
    id: 'green_commute_10',
    name: 'Green Commuter',
    description: 'Travel 10km by walking or cycling in a single day.',
    icon: '🏃',
    goal: 10,
    unit: 'km',
    type: 'daily',
    reward: 30
  }
};
