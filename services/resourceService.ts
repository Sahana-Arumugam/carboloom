import { EcoResource } from '../types';

const resources: EcoResource[] = [
    {
        title: 'UN Climate Change (UNFCCC)',
        description: 'The official source for international climate policy, negotiations, and news from the United Nations.',
        url: 'https://unfccc.int/'
    },
    {
        title: 'NASA: Global Climate Change',
        description: 'Explore data, visualizations, and vital signs of the planet\'s climate from a leading scientific agency.',
        url: 'https://climate.nasa.gov/'
    },
    {
        title: 'Project Drawdown',
        description: 'A leading resource for discovering and understanding a comprehensive portfolio of climate solutions.',
        url: 'https://drawdown.org/'
    },
    {
        title: 'The World Bank | Climate Change',
        description: 'Focuses on the intersection of climate action and global development, providing data and reports.',
        url: 'https://www.worldbank.org/en/topic/climatechange'
    },
    {
        title: 'Ministry of Environment, Forest and Climate Change (India)',
        description: 'The official government portal for India-specific environmental policies, reports, and initiatives.',
        url: 'https://moefcc.gov.in/'
    },
    {
        title: 'Centre for Science and Environment (CSE India)',
        description: 'A respected Indian public interest research and advocacy organisation based in New Delhi.',
        url: 'https://www.cseindia.org/'
    }
];

export const resourceService = {
    getResources: (): EcoResource[] => {
        return resources;
    }
};
