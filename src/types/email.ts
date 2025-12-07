export type EmailStatus = 'active' | 'suspended' | 'pending';

export interface EmailAccount {
    id: string;
    email: string;
    displayName: string;
    provider: string;
    status: EmailStatus;
    department: string;
    quotaUsed: number;  // in MB
    quotaLimit: number; // in MB
    createdDate: string;
    lastLogin?: string;
}
