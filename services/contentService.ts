import { Quiz, ContentCategory } from '../types';

const quizzes: Quiz[] = [
    {
        id: 'sustainability-basics-1',
        title: 'Sustainability Basics',
        description: 'Test your knowledge of fundamental environmental concepts at home.',
        category: 'Home',
        reward: { points: 50, badgeId: 'quiz_master' },
        questions: [
            {
                id: 'q1',
                question: 'Which of the following is a major greenhouse gas responsible for global warming?',
                options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'],
                correctAnswerIndex: 2,
                explanation: 'Carbon Dioxide (CO2) is a primary greenhouse gas, trapping heat in the atmosphere and contributing to climate change.'
            },
            {
                id: 'q2',
                question: 'What does "composting" primarily help reduce?',
                options: ['Plastic waste in oceans', 'Methane emissions from landfills', 'Air pollution from cars', 'Water consumption'],
                correctAnswerIndex: 1,
                explanation: 'Composting organic waste like food scraps prevents it from rotting in landfills, where it would produce methane, a potent greenhouse gas.'
            },
            {
                id: 'q3_home',
                question: 'What are "energy vampires" in a household context?',
                options: ['Pests that eat electrical wires', 'Appliances that draw power even when turned off', 'A type of energy-efficient light bulb', 'Solar panels that work at night'],
                correctAnswerIndex: 1,
                explanation: 'Also known as "phantom load", energy vampires are devices that consume electricity even in standby mode, contributing to wasted energy.'
            },
            {
                id: 'q4_home',
                question: 'When using a washing machine, which setting is the most energy-efficient for a standard load?',
                options: ['Hot Wash', 'Warm Wash', 'Cold Wash', 'Extra Rinse Cycle'],
                correctAnswerIndex: 2,
                explanation: 'Heating water accounts for about 90% of the energy your washing machine uses. Switching to cold water can save a significant amount of energy.'
            },
            {
                id: 'q5_home',
                question: 'Replacing one old incandescent bulb with a new LED bulb can save how much energy over its lifetime?',
                options: ['About the same', 'Up to 25%', 'Up to 50%', 'Up to 80%'],
                correctAnswerIndex: 3,
                explanation: 'LED bulbs are incredibly efficient, using up to 80% less energy and lasting up to 25 times longer than traditional incandescent bulbs.'
            },
            {
                id: 'q6_home',
                question: 'What is the most effective way to save water at home?',
                options: ['Taking baths instead of showers', 'Fixing leaky faucets', 'Watering the lawn during the day', 'Washing dishes by hand'],
                correctAnswerIndex: 1,
                explanation: 'A single leaky faucet can waste thousands of liters of water per year. Fixing leaks is one of the most impactful ways to conserve water.'
            },
            {
                id: 'q7_home',
                question: 'Which of these is a common source of indoor air pollution?',
                options: ['Houseplants', 'LED lights', 'Cleaning products with VOCs', 'Tap water'],
                correctAnswerIndex: 2,
                explanation: 'Volatile Organic Compounds (VOCs) are emitted by many common household products and can contribute to poor indoor air quality. Choosing low-VOC products is a healthier and more eco-friendly option.'
            },
            {
                id: 'q9_home_new',
                question: 'What does the number inside the recycling symbol on a plastic item indicate?',
                options: ['Its quality level', 'The type of plastic resin used', 'How many times it has been recycled', 'The percentage of recycled material'],
                correctAnswerIndex: 1,
                explanation: 'The number (1-7) identifies the type of plastic, which helps sorting facilities determine if and how it can be recycled. Not all numbers are recyclable everywhere.'
            },
            {
                id: 'q10_home_new',
                question: 'Lowering your water heater\'s thermostat to 49°C (120°F) is an example of what?',
                options: ['Energy production', 'Energy reduction', 'Energy efficiency', 'Energy conservation'],
                correctAnswerIndex: 3,
                explanation: 'Energy conservation is reducing energy consumption through behavioral changes. Energy efficiency means using technology to get the same output with less energy.'
            },
            {
                id: 'q11_home_new',
                question: 'What is "greywater"?',
                options: ['Contaminated water from factories', 'Water from your sinks, showers, and laundry', 'Rainwater collected from roofs', 'Another term for tap water'],
                correctAnswerIndex: 1,
                explanation: 'Greywater is gently used household wastewater that can be recycled for uses like watering plants or flushing toilets, reducing overall water consumption.'
            },
            {
                id: 'q12_home_new',
                question: 'Which of these actions helps reduce "fast furniture" waste?',
                options: ['Buying new furniture every season', 'Purchasing furniture made from particleboard', 'Repairing or buying second-hand furniture', 'Leaving old furniture on the sidewalk'],
                correctAnswerIndex: 2,
                explanation: '"Fast furniture" is cheaply made and designed to be disposable. Choosing durable, second-hand, or repairable pieces reduces landfill waste and resource consumption.'
            }
        ]
    },
    {
        id: 'food-footprint-quiz',
        title: 'Your Food\'s Footprint',
        description: 'How much do you know about the environmental impact of what you eat?',
        category: 'Food',
        reward: { points: 50 },
        questions: [
            {
                id: 'q1_food',
                question: 'Which of these food items generally has the highest carbon footprint per kilogram?',
                options: ['Lentils', 'Beef', 'Chicken', 'Potatoes'],
                correctAnswerIndex: 1,
                explanation: 'Beef production is resource-intensive, requiring large amounts of land and water, and cattle produce significant methane emissions, leading to a high carbon footprint.'
            },
            {
                id: 'q2_food',
                question: 'What is the best way to reduce the carbon footprint of your food shopping?',
                options: ['Buying only organic food', 'Eating local and seasonal produce', 'Avoiding all packaged food', 'Only shopping at large supermarkets'],
                correctAnswerIndex: 1,
                explanation: 'Eating local and seasonal produce reduces "food miles" (the distance food travels) and the energy required for out-of-season cultivation.'
            },
            {
                id: 'q3_food',
                question: 'Approximately how much of the world\'s food produced for human consumption is lost or wasted each year?',
                options: ['About 10%', 'About one-third (33%)', 'About 50%', 'About 5%'],
                correctAnswerIndex: 1,
                explanation: 'According to the UN, about one-third of all food produced globally is lost or wasted, which has a massive carbon footprint due to methane emissions from landfills.'
            },
            {
                id: 'q4_food',
                question: 'Which of these plant-based milks generally has the lowest environmental footprint (considering water and land use)?',
                options: ['Almond Milk', 'Soy Milk', 'Oat Milk', 'Rice Milk'],
                correctAnswerIndex: 2,
                explanation: 'Oat milk generally has a lower footprint compared to others. Almond milk is very water-intensive, and rice farming can produce significant methane emissions.'
            },
            {
                id: 'q5_food',
                question: 'When grocery shopping, what is the best strategy to minimize plastic waste?',
                options: ['Buying items in smaller packages', 'Choosing products in glass or metal containers', 'Bringing your own reusable bags and produce bags', 'Putting all produce into a single plastic bag'],
                correctAnswerIndex: 2,
                explanation: 'Preventing waste at the source is most effective. Reusable bags for both groceries and individual produce items significantly reduce the need for single-use plastics.'
            },
            {
                id: 'q6_food',
                question: 'What does the term "regenerative agriculture" refer to?',
                options: ['Farming with robots', 'Farming practices that improve soil health and biodiversity', 'Growing food in vertical farms', 'Hydroponic farming only'],
                correctAnswerIndex: 1,
                explanation: 'Regenerative agriculture focuses on rehabilitating the entire ecosystem of the farm, which can help sequester carbon in the soil and improve water cycles.'
            },
            {
                id: 'q8_food_new',
                question: 'What major environmental issue is often associated with unsustainable palm oil production?',
                options: ['Ocean acidification', 'Deforestation and habitat loss', 'Ozone layer depletion', 'Soil salinization'],
                correctAnswerIndex: 1,
                explanation: 'Large areas of tropical rainforests are cleared to make way for palm oil plantations, destroying critical habitats for species like orangutans and tigers.'
            },
            {
                id: 'q9_food_new',
                question: 'What is the key difference between a "Use-By" date and a "Best-Before" date on food packaging?',
                options: ['They mean the same thing', '"Use-By" is about safety; "Best-Before" is about quality', '"Best-Before" is for meat; "Use-By" is for vegetables', 'There is no legal difference'],
                correctAnswerIndex: 1,
                explanation: 'A "Use-By" date is for perishable foods and indicates when it is no longer safe to eat. A "Best-Before" date indicates when the product may lose some flavor or texture but is often still safe to consume. Understanding this can prevent food waste.'
            },
            {
                id: 'q10_food_new',
                question: 'What does the "Fair Trade" certification on a product like coffee or chocolate primarily ensure?',
                options: ['The product is organic', 'The product is low in sugar', 'Ethical treatment and fair wages for farmers', 'The product was locally sourced'],
                correctAnswerIndex: 2,
                explanation: 'Fair Trade standards are designed to support farmers and workers in developing countries by ensuring they receive fair prices, have safe working conditions, and follow environmental standards.'
            },
            {
                id: 'q11_food_new',
                question: 'Which of these common foods has the highest "water footprint" (liters of water per kg of product)?',
                options: ['Tomatoes', 'Chocolate', 'Rice', 'Bread'],
                correctAnswerIndex: 1,
                explanation: 'Chocolate (from cacao beans) has an incredibly high water footprint, often exceeding 17,000 liters per kilogram, due to the long and water-intensive process of growing and processing cacao.'
            }
        ]
    },
    {
        id: 'travel-savvy-quiz',
        title: 'Travel Savvy',
        description: 'How eco-friendly is your commute? Test your knowledge on sustainable travel.',
        category: 'Travel',
        reward: { points: 50 },
        questions: [
            {
                id: 'q1_travel',
                question: 'For a short-distance trip in a city, which of these transport modes has the lowest carbon footprint?',
                options: ['Cab', 'Bus', 'Motorcycle', 'Cycling'],
                correctAnswerIndex: 3,
                explanation: 'Cycling is a zero-emission mode of transport, making it the most environmentally friendly option for short trips.'
            },
            {
                id: 'q2_travel',
                question: 'What is "carbon offsetting" in the context of air travel?',
                options: ['Flying on planes with special carbon filters', 'Choosing to fly during off-peak hours', 'Donating to a project that reduces greenhouse gases to compensate for your flight\'s emissions', 'Packing lighter to reduce the plane\'s weight'],
                correctAnswerIndex: 2,
                explanation: 'Carbon offsetting allows travelers to invest in environmental projects (like reforestation or renewable energy) to balance out the carbon emissions from their flights.'
            },
            {
                id: 'q3_travel',
                question: 'Which of these is NOT a good practice for sustainable tourism?',
                options: ['Respecting local customs and culture', 'Buying single-use plastic water bottles', 'Supporting local businesses and artisans', 'Conserving water and energy in your accommodation'],
                correctAnswerIndex: 1,
                explanation: 'Single-use plastics are a major source of pollution. Carrying a reusable water bottle is a simple way to reduce waste while traveling.'
            },
            {
                id: 'q4_travel',
                question: 'How does maintaining proper tire pressure on a car affect fuel efficiency?',
                options: ['It has no effect', 'It slightly decreases efficiency', 'It can significantly improve efficiency', 'It only matters for electric cars'],
                correctAnswerIndex: 2,
                explanation: 'Underinflated tires increase rolling resistance, forcing your engine to work harder and burn more fuel. Proper tire pressure can improve fuel efficiency by several percent.'
            },
            {
                id: 'q5_travel',
                question: 'For a 500 km journey, which mode of transport is generally the most carbon-efficient per passenger?',
                options: ['Flying in a commercial plane', 'Driving alone in a car', 'Taking a train', 'Taking a bus'],
                correctAnswerIndex: 2,
                explanation: 'Trains are highly efficient for moving many people at once, typically resulting in the lowest carbon emissions per passenger for medium to long-distance travel, followed closely by buses.'
            },
            {
                id: 'q6_travel',
                question: 'What is the concept of a "15-minute city"?',
                options: ['A city where all commutes are exactly 15 minutes long', 'A city where residents can access most of their daily needs within a 15-minute walk or bike ride', 'A special express lane for cars in cities', 'A city that only allows electric vehicles'],
                correctAnswerIndex: 1,
                explanation: 'The 15-minute city concept promotes sustainable urban living by reducing the need for cars, encouraging active transport, and fostering local communities.'
            },
            {
                id: 'q8_travel_new',
                question: 'What is a core principle of "ecotourism"?',
                options: ['Visiting as many countries as possible in one trip', 'Only traveling to five-star resorts', 'Minimizing environmental impact and supporting local communities', 'Traveling with a large group of people'],
                correctAnswerIndex: 2,
                explanation: 'Ecotourism is about responsible travel to natural areas that conserves the environment, sustains the well-being of the local people, and involves interpretation and education.'
            },
            {
                id: 'q9_travel_new',
                question: 'Compared to flying, modern cruise ships have what kind of carbon footprint per passenger-kilometer?',
                options: ['Significantly lower', 'About the same', 'Often significantly higher', 'Zero, as they use ocean currents'],
                correctAnswerIndex: 2,
                explanation: 'Large cruise ships are like floating cities and consume enormous amounts of fuel. Per passenger, their carbon emissions can be greater than those from a long-haul flight, in addition to other pollution concerns.'
            },
            {
                id: 'q10_travel_new',
                question: 'What is "slow travel"?',
                options: ['A trend of taking intentionally delayed flights', 'Traveling only by walking', 'Connecting with a local culture by staying in one place for longer', 'A type of high-speed train'],
                correctAnswerIndex: 2,
                explanation: '"Slow travel" emphasizes a deeper connection to the local environment, culture, and people by avoiding rushed itineraries. It often involves more sustainable transport like trains and supports local economies.'
            },
            {
                id: 'q11_travel_new',
                question: 'What is a primary environmental benefit of carpooling?',
                options: ['It makes the car heavier and more stable', 'It reduces the number of vehicles on the road, decreasing emissions and traffic', 'It allows you to use the express lane', 'It reduces wear on your car\'s tires'],
                correctAnswerIndex: 1,
                explanation: 'Carpooling directly reduces the total number of cars used for commuting, which in turn lowers overall greenhouse gas emissions, fuel consumption, and traffic congestion.'
            }
        ]
    },
    {
        id: 'conscious-consumer-quiz',
        title: 'Conscious Consumer',
        description: 'Think you\'re a smart shopper? Test your knowledge on sustainable purchasing.',
        category: 'Shopping',
        reward: { points: 50 },
        questions: [
            {
                id: 'q1_shop',
                question: 'What is "fast fashion"?',
                options: ['Clothing that helps you run faster', 'A style of clothing from the 1980s', 'Inexpensive clothing produced rapidly in response to trends', 'A brand of luxury sportswear'],
                correctAnswerIndex: 2,
                explanation: 'Fast fashion is a business model characterized by cheap, trendy clothing that is mass-produced, leading to significant environmental and social costs.'
            },
            {
                id: 'q2_shop',
                question: 'When buying clothes, which material is generally a more sustainable choice than conventional cotton?',
                options: ['Polyester', 'Organic Cotton', 'Acrylic', 'Nylon'],
                correctAnswerIndex: 1,
                explanation: 'Organic cotton is grown without synthetic pesticides and fertilizers and typically uses less water than conventional cotton, making it a more eco-friendly option.'
            },
            {
                id: 'q3_shop',
                question: 'What does the "circular economy" concept mean in the context of shopping?',
                options: ['Only buying from stores that are circular in shape', 'A system where products are designed to be reused, repaired, and recycled rather than thrown away', 'A shopping festival that happens once a year', 'An economy based on bartering goods'],
                correctAnswerIndex: 1,
                explanation: 'The circular economy aims to eliminate waste by keeping products and materials in use for as long as possible through practices like recycling, upcycling, and repair.'
            },
            {
                id: 'q4_shop',
                question: 'What is the main environmental problem associated with purchasing new electronics frequently?',
                options: ['They are too expensive', 'They often require software updates', 'The creation of "e-waste" which is difficult to recycle and contains toxic materials', 'They use too much electricity'],
                correctAnswerIndex: 2,
                explanation: 'Electronic waste, or e-waste, is a growing global problem. Discarded devices contain hazardous materials that can pollute the environment if not disposed of properly.'
            },
            {
                id: 'q5_shop',
                question: 'What is the term for marketing that deceptively promotes a company\'s products as environmentally friendly?',
                options: ['Ecomarketing', 'Greenwashing', 'Sustaina-selling', 'Nature-baiting'],
                correctAnswerIndex: 1,
                explanation: 'Greenwashing is a misleading marketing tactic where a company spends more time and money claiming to be "green" through advertising than actually implementing business practices that minimize environmental impact.'
            },
            {
                id: 'q8_shop',
                question: 'What is a key benefit of buying second-hand items?',
                options: ['They are always more durable', 'They extend the life of a product, reducing waste and the need for new production', 'They come with a lifetime warranty', 'They are always cheaper than new items'],
                correctAnswerIndex: 1,
                explanation: 'The most sustainable product is one that already exists. Buying second-hand is a cornerstone of the circular economy, reducing the environmental impact associated with manufacturing new goods.'
            },
            {
                id: 'q9_shop_new',
                question: 'What are "microplastics," a common environmental concern related to synthetic clothing like polyester?',
                options: ['A type of durable fabric', 'Tiny plastic fibers shed from clothes during washing', 'Small plastic beads used in packaging', 'A brand of recycled plastic'],
                correctAnswerIndex: 1,
                explanation: 'When synthetic fabrics are washed, they release thousands of tiny plastic fibers (microplastics) which enter waterways, harm aquatic life, and can enter the food chain.'
            },
            {
                id: 'q10_shop_new',
                question: 'The "Right to Repair" movement advocates for what?',
                options: ['Free repairs for all electronic devices', 'Making it easier and more affordable for consumers to repair their own products', 'Banning the sale of products that can break', 'Only allowing certified technicians to perform repairs'],
                correctAnswerIndex: 1,
                explanation: 'The Right to Repair movement pushes against planned obsolescence by advocating for laws that require companies to make parts, tools, and repair information available to consumers and independent shops, extending product lifespans and reducing e-waste.'
            },
            {
                id: 'q11_shop_new',
                question: 'What does the term "planned obsolescence" mean for electronics?',
                options: ['A plan to recycle obsolete parts', 'Designing products to have a limited lifespan, encouraging replacement', 'A product launch schedule', 'A software update plan'],
                correctAnswerIndex: 1,
                explanation: 'Planned obsolescence is a strategy of designing products to become outdated or non-functional after a certain period, which drives consumerism and contributes significantly to e-waste.'
            },
            {
                id: 'q12_shop_new',
                question: 'Which of these packaging materials is infinitely recyclable without loss of quality?',
                options: ['Plastic', 'Paper', 'Aluminum', 'All of the above'],
                correctAnswerIndex: 2,
                explanation: 'Aluminum (and glass) can be recycled over and over again without losing its quality or purity. Plastic and paper, on the other hand, experience a decrease in quality each time they are recycled (downcycling).'
            }
        ]
    },
    {
        id: 'e-waste-warriors-quiz',
        title: 'E-Waste Warriors',
        description: 'Test your knowledge on the impact of electronics and managing e-waste.',
        category: 'Waste',
        reward: { points: 50 },
        questions: [
            {
                id: 'q1_ewaste',
                question: 'What is "e-waste"?',
                options: ['Energy-efficient waste', 'Economical waste products', 'Discarded electronic devices', 'Extra wiring from installations'],
                correctAnswerIndex: 2,
                explanation: 'E-waste refers to all types of electrical and electronic equipment that have been discarded as waste without the intent of re-use.'
            },
            {
                id: 'q2_ewaste',
                question: 'Which of these is a major environmental concern with improperly disposed e-waste?',
                options: ['It takes up too much space in landfills', 'It can be recycled into new products easily', 'It can leak toxic materials like lead and mercury into the soil and water', 'It attracts pests to landfill sites'],
                correctAnswerIndex: 2,
                explanation: 'E-waste contains hazardous substances like lead, mercury, and cadmium, which can contaminate ecosystems and harm human health if not managed correctly.'
            },
            {
                id: 'q3_ewaste',
                question: 'What is "planned obsolescence" in the electronics industry?',
                options: ['A plan for future software updates', 'A strategy of designing products to have a limited lifespan, encouraging consumers to buy new ones', 'A feature that makes devices more durable', 'A recycling program planned by the manufacturer'],
                correctAnswerIndex: 1,
                explanation: 'Planned obsolescence is a controversial business practice that drives consumerism by making products artificially non-functional or outdated after a certain period.'
            },
            {
                id: 'q4_ewaste',
                question: 'What does the "Right to Repair" movement advocate for?',
                options: ['Free device repairs from the manufacturer for life', 'Making parts, tools, and information available for consumers to repair their own devices', 'Banning the sale of devices that can break', 'Only allowing authorized dealers to perform repairs'],
                correctAnswerIndex: 1,
                explanation: 'The Right to Repair movement aims to empower consumers to fix their own electronics, which extends product lifespans and reduces e-waste.'
            },
            {
                id: 'q5_ewaste',
                question: 'What is the most environmentally friendly action you can take with an old, but still working, smartphone?',
                options: ['Throw it in the regular trash', 'Keep it in a drawer indefinitely', 'Sell it, donate it, or give it to someone who can use it', 'Take it to a standard recycling center'],
                correctAnswerIndex: 2,
                explanation: 'Re-use is the highest form of waste reduction. Extending the life of a device by passing it on to someone else is more sustainable than recycling it, as it avoids the energy and resources needed for both recycling and manufacturing a new device.'
            },
            {
                id: 'q6_ewaste',
                question: 'If a device is broken beyond repair, what is the proper way to dispose of it?',
                options: ['Put it in your household recycling bin with plastics and paper', 'Find a certified e-waste recycling facility or take-back program', 'Bury it in the backyard', 'Leave it on the curb'],
                correctAnswerIndex: 1,
                explanation: 'E-waste must be handled by specialized recyclers who can safely extract valuable materials and dispose of hazardous components without harming the environment.'
            }
        ]
    }
];

export const contentService = {
    getQuizzes: (): Quiz[] => {
        return quizzes;
    }
};