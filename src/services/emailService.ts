import api from './api';
import type { EmailAccount, EmailStatus } from '../types/email';

export class EmailService {
    static async getEmails(filters?: {
        status?: EmailStatus;
        provider?: string;
        department?: string;
    }): Promise<EmailAccount[]> {
        try {
            const params = new URLSearchParams();
            if (filters?.status) params.append('status', filters.status);
            if (filters?.provider) params.append('provider', filters.provider);
            if (filters?.department) params.append('department', filters.department);
            const response = await api.get<EmailAccount[]>('/emails', { params });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch emails:', error);
            throw new Error('Failed to load email accounts.');
        }
    }

    static async getEmail(id: string): Promise<EmailAccount> {
        try {
            const response = await api.get<EmailAccount>(`/emails/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to load email account.');
        }
    }

    static async createEmail(data: Omit<EmailAccount, 'id' | 'quotaUsed'>): Promise<EmailAccount> {
        try {
            const response = await api.post<EmailAccount>('/emails/', data);
            return response.data;
        } catch (error) {
            throw new Error('Failed to create email account.');
        }
    }

    static async updateEmail(id: string, data: Partial<EmailAccount>): Promise<EmailAccount> {
        try {
            const response = await api.put<EmailAccount>(`/emails/${id}`, data);
            return response.data;
        } catch (error) {
            throw new Error('Failed to update email account.');
        }
    }

    static async deleteEmail(id: string): Promise<void> {
        try {
            await api.delete(`/emails/${id}`);
        } catch (error) {
            throw new Error('Failed to delete email account.');
        }
    }
}
