import type { Server } from '../types/server';

export const mockServers: Server[] = [
    {
        id: 'srv-001',
        name: 'NCC-Core-Prod-01',
        ipAddress: '192.168.1.10',
        os: 'Ubuntu 22.04 LTS',
        specs: { cpu: '8 vCPU', ram: '32GB', storage: '500GB SSD' },
        location: 'US-East-1',
        provider: 'AWS',
        status: 'online',
        category: 'production',
        responsibleTeam: 'DevOps',
        lastPatchDate: '2023-10-15',
        tags: ['web', 'api']
    },
    {
        id: 'srv-002',
        name: 'NCC-Db-Prod-01',
        ipAddress: '192.168.1.15',
        os: 'RHEL 9',
        specs: { cpu: '16 vCPU', ram: '64GB', storage: '1TB NVMe' },
        location: 'US-East-1',
        provider: 'AWS',
        status: 'online',
        category: 'production',
        responsibleTeam: 'DBA',
        lastPatchDate: '2023-10-10',
        tags: ['database', 'postgres']
    },
    {
        id: 'srv-003',
        name: 'NCC-Staging-Web',
        ipAddress: '10.0.0.5',
        os: 'Ubuntu 22.04 LTS',
        specs: { cpu: '4 vCPU', ram: '16GB', storage: '200GB SSD' },
        location: 'On-Prem',
        provider: 'Internal',
        status: 'warning',
        category: 'staging',
        responsibleTeam: 'QA',
        lastPatchDate: '2023-11-01',
        tags: ['frontend']
    },
    {
        id: 'srv-004',
        name: 'NCC-Dev-Build',
        ipAddress: '10.0.0.20',
        os: 'Windows Server 2022',
        specs: { cpu: '8 vCPU', ram: '32GB', storage: '1TB HDD' },
        location: 'On-Prem',
        provider: 'Internal',
        status: 'maintenance',
        category: 'development',
        responsibleTeam: 'DevOps',
        lastPatchDate: '2023-09-20',
        tags: ['jenkins', 'build']
    },
    {
        id: 'srv-005',
        name: 'Client-X-Dedicated',
        ipAddress: '203.0.113.50',
        os: 'CentOS 7',
        specs: { cpu: '4 vCPU', ram: '8GB', storage: '100GB SSD' },
        location: 'Europe-West',
        provider: 'Azure',
        status: 'offline',
        category: 'production',
        responsibleTeam: 'Client Support',
        lastPatchDate: '2023-08-15',
        tags: ['legacy']
    }
];
