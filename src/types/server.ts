export type ServerStatus = 'online' | 'offline' | 'maintenance' | 'warning';
export type ServerCategory = 'production' | 'staging' | 'development' | 'testing';

export interface Server {
    id: string;
    name: string;
    ipAddress: string;
    os: string;
    specs: {
        cpu: string;
        ram: string;
        storage: string;
    };
    location: string;
    provider: string; // e.g. AWS, Azure, On-Prem
    status: ServerStatus;
    category: ServerCategory;
    responsibleTeam: string;
    lastPatchDate: string;
    tags?: string[];
}
