import api from './api';
import type { Repository, RepoVisibility } from '../types/repository';

export class RepositoryService {
    static async getRepositories(filters?: {
        provider?: string;
        language?: string;
        visibility?: RepoVisibility;
    }): Promise<Repository[]> {
        try {
            const params = new URLSearchParams();
            if (filters?.provider) params.append('provider', filters.provider);
            if (filters?.language) params.append('language', filters.language);
            if (filters?.visibility) params.append('visibility', filters.visibility);
            const response = await api.get<Repository[]>('/repositories', { params });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch repositories:', error);
            throw new Error('Failed to load repositories.');
        }
    }

    static async getRepository(id: string): Promise<Repository> {
        try {
            const response = await api.get<Repository>(`/repositories/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to load repository.');
        }
    }

    static async createRepository(data: Omit<Repository, 'id' | 'branches' | 'openIssues'>): Promise<Repository> {
        try {
            const response = await api.post<Repository>('/repositories/', data);
            return response.data;
        } catch (error) {
            throw new Error('Failed to create repository.');
        }
    }

    static async updateRepository(id: string, data: Partial<Repository>): Promise<Repository> {
        try {
            const response = await api.put<Repository>(`/repositories/${id}`, data);
            return response.data;
        } catch (error) {
            throw new Error('Failed to update repository.');
        }
    }

    static async deleteRepository(id: string): Promise<void> {
        try {
            await api.delete(`/repositories/${id}`);
        } catch (error) {
            throw new Error('Failed to delete repository.');
        }
    }
}
