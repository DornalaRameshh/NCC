import type { Domain } from '../types/domain';

export const mockDomains: Domain[] = [
    {
        id: 'dom-001',
        name: 'ncc-tech.com',
        registrar: 'GoDaddy',
        registrationDate: '2020-05-15',
        expiryDate: '2025-05-15',
        autoRenew: true,
        owner: 'Internal Product',
        status: 'active',
        ssl: {
            issuer: 'Let\'s Encrypt',
            validFrom: '2023-11-01',
            validTo: '2024-02-01',
            status: 'valid'
        },
        dnsRecords: [
            { id: 'dns-1', type: 'A', name: '@', value: '192.168.1.10', ttl: 3600 },
            { id: 'dns-2', type: 'CNAME', name: 'www', value: 'ncc-tech.com', ttl: 3600 },
            { id: 'dns-3', type: 'MX', name: '@', value: 'smtp.google.com', ttl: 14400 }
        ],
        cost: 15.99
    },
    {
        id: 'dom-002',
        name: 'client-alpha.net',
        registrar: 'Namecheap',
        registrationDate: '2022-01-20',
        expiryDate: '2024-01-20', // Expiring/Expired soon
        autoRenew: false,
        owner: 'Client Alpha',
        status: 'active',
        ssl: {
            issuer: 'DigiCert',
            validFrom: '2023-01-20',
            validTo: '2024-01-20',
            status: 'expiring_soon'
        },
        dnsRecords: [
            { id: 'dns-4', type: 'A', name: '@', value: '203.0.113.50', ttl: 600 }
        ],
        cost: 12.50
    },
    {
        id: 'dom-003',
        name: 'legacy-project.org',
        registrar: 'Bluehost',
        registrationDate: '2018-03-10',
        expiryDate: '2023-03-10', // Already expired
        autoRenew: false,
        owner: 'Legacy Support',
        status: 'expired',
        ssl: {
            issuer: 'None',
            validFrom: '',
            validTo: '',
            status: 'invalid'
        },
        cost: 18.00
    },
    {
        id: 'dom-004',
        name: 'ncc-staging.io',
        registrar: 'AWS Route53',
        registrationDate: '2023-06-01',
        expiryDate: '2024-06-01',
        autoRenew: true,
        owner: 'DevOps Team',
        status: 'active',
        ssl: {
            issuer: 'AWS ACM',
            validFrom: '2023-06-01',
            validTo: '2024-07-01', // Long validity
            status: 'valid'
        },
        cost: 35.00
    }
];
