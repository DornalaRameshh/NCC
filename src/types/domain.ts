export type DomainStatus = 'active' | 'expired' | 'pending_transfer' | 'grace_period';
export type SSLStatus = 'valid' | 'expired' | 'expiring_soon' | 'invalid';

export interface DNSRecord {
    id: string;
    type: 'A' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'AAAA';
    name: string;
    value: string;
    ttl: number;
}

export interface SSLInfo {
    issuer: string;
    validFrom: string;
    validTo: string;
    status: SSLStatus;
}

export interface Domain {
    id: string;
    name: string;
    registrar: string;
    registrationDate: string;
    expiryDate: string;
    autoRenew: boolean;
    owner: string; // Client or Product name
    status: DomainStatus;
    ssl?: SSLInfo;
    dnsRecords?: DNSRecord[];
    cost?: number; // Annual cost
}
