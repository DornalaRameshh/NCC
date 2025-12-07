import api from './api';
import type { StorageBucket, StorageType } from '../types/storage';

export class StorageService {
    static async getStorage(filters?: {
        provider?: string;
        type?: StorageType;
        region?: string;
    }): Promise<StorageBucket[]> {
        try {
            const params = new URLSearchParams();
            if (filters?.provider) params.append('provider', filters.provider);
            if (filters?.type) params.append('type', filters.type);
            if (filters?.region) params.append('region', filters.region);
            const response = await api.get<StorageBucket[]>('/storage', { params });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch storage:', error);
            throw new Error('Failed to load storage.');
        }
    }

    static async getStorageItem(id: string): Promise<StorageBucket> {
        try {
            const response = await api.get<StorageBucket>(`/storage/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to load storage item.');
        }
    }

    static async createStorage(data: Omit<StorageBucket, 'id' | 'usageBytes' | 'createdDate'>): Promise<StorageBucket> {
        try {
            const response = await api.post<StorageBucket>('/storage/', data);
            return response.data;
        } catch (error) {
            throw new Error('Failed to create storage.');
        }
    }

    static async updateStorage(id: string, data: Partial<StorageBucket>): Promise<StorageBucket> {
        try {
            const response = await api.put<StorageBucket>(`/storage/${id}`, data);
            return response.data;
        } catch (error) {
            throw new Error('Failed to update storage.');
        }
    }

    static async deleteStorage(id: string): Promise<void> {
        try {
            await api.delete(`/storage/${id}`);
        } catch (error) {
            throw new Error('Failed to delete storage.');
        }
    }
}
