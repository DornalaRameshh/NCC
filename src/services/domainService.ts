import api from './api';
import type { Domain, DomainStatus } from '../types/domain';

// Domain API Service
export class DomainService {
    /**
     * Fetch all domains with optional filtering
     */
    static async getDomains(filters?: {
        status?: DomainStatus;
        registrar?: string;
    }): Promise<Domain[]> {
        try {
            const params = new URLSearchParams();
            if (filters?.status) params.append('status', filters.status);
            if (filters?.registrar) params.append('registrar', filters.registrar);

            const response = await api.get<Domain[]>('/domains', { params });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch domains:', error);
            throw new Error('Failed to load domains. Please check your connection.');
        }
    }

    /**
     * Get a single domain by ID
     */
    static async getDomain(id: string): Promise<Domain> {
        try {
            const response = await api.get<Domain>(`/domains/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch domain ${id}:`, error);
            throw new Error('Failed to load domain details.');
        }
    }

    /**
     * Create a new domain
     */
    static async createDomain(
        domainData: Omit<Domain, 'id'>
    ): Promise<Domain> {
        try {
            const response = await api.post<Domain>('/domains/', domainData);
            return response.data;
        } catch (error) {
            console.error('Failed to create domain:', error);
            throw new Error('Failed to create domain. Please try again.');
        }
    }

    /**
     * Update an existing domain
     */
    static async updateDomain(
        id: string,
        domainData: Partial<Omit<Domain, 'id'>>
    ): Promise<Domain> {
        try {
            const response = await api.put<Domain>(`/domains/${id}`, domainData);
            return response.data;
        } catch (error) {
            console.error(`Failed to update domain ${id}:`, error);
            throw new Error('Failed to update domain. Please try again.');
        }
    }

    /**
     * Delete a domain
     */
    static async deleteDomain(id: string): Promise<void> {
        try {
            await api.delete(`/domains/${id}`);
        } catch (error) {
            console.error(`Failed to delete domain ${id}:`, error);
            throw new Error('Failed to delete domain. Please try again.');
        }
    }

    /**
     * Add a DNS record to a domain
     */
    static async addDNSRecord(
        domainId: string,
        recordData: {
            type: string;
            name: string;
            value: string;
            ttl: number;
        }
    ): Promise<Domain> {
        try {
            const response = await api.post<Domain>(`/domains/${domainId}/dns`, recordData);
            return response.data;
        } catch (error) {
            console.error(`Failed to add DNS record to domain ${domainId}:`, error);
            throw new Error('Failed to add DNS record. Please try again.');
        }
    }

    /**
     * Update a DNS record
     */
    static async updateDNSRecord(
        domainId: string,
        recordId: string,
        recordData: Partial<{
            type: string;
            name: string;
            value: string;
            ttl: number;
        }>
    ): Promise<Domain> {
        try {
            const response = await api.put<Domain>(`/domains/${domainId}/dns/${recordId}`, recordData);
            return response.data;
        } catch (error) {
            console.error(`Failed to update DNS record ${recordId}:`, error);
            throw new Error('Failed to update DNS record. Please try again.');
        }
    }

    /**
     * Delete a DNS record
     */
    static async deleteDNSRecord(domainId: string, recordId: string): Promise<Domain> {
        try {
            const response = await api.delete<Domain>(`/domains/${domainId}/dns/${recordId}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to delete DNS record ${recordId}:`, error);
            throw new Error('Failed to delete DNS record. Please try again.');
        }
    }
}
