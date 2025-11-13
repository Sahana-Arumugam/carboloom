import React from 'react';
import { resourceService } from '../services/resourceService';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

export const EcoResources: React.FC = () => {
    const resources = resourceService.getResources();

    return (
        <div className="space-y-6">
            {resources.map((resource) => (
                <div key={resource.title} className="bg-card p-6 rounded-lg shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-text">{resource.title}</h3>
                        <p className="text-text-secondary mt-1">{resource.description}</p>
                    </div>
                    <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center flex-shrink-0 bg-primary-light hover:bg-primary text-white font-semibold py-2 px-5 rounded-full transition-colors duration-300 w-full sm:w-auto"
                        aria-label={`Visit ${resource.title}`}
                    >
                        <span>Visit Site</span>
                        <ExternalLinkIcon className="h-4 w-4 ml-2" />
                    </a>
                </div>
            ))}
        </div>
    );
};
