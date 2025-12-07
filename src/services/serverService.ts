import api from './api';
import type { Server, ServerStatus, ServerCategory } from '../types/server';

// Server API Service
export class ServerService {
    /**
     * Fetch all servers with optional filtering
     */
    static async getServers(filters?: {
        status?: ServerStatus;
        category?: ServerCategory;
    }): Promise<Server[]> {
        try {
            const params = new URLSearchParams();
            if (filters?.status) params.append('status', filters.status);
            if (filters?.category) params.append('category', filters.category);

            const response = await api.get<Server[]>('/servers', { params });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch servers:', error);
            throw new Error('Failed to load servers. Please check your connection.');
        }
    }

    /**
     * Get a single server by ID
     */
    static async getServer(id: string): Promise<Server> {
        try {
            const response = await api.get<Server>(`/servers/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch server ${id}:`, error);
            throw new Error('Failed to load server details.');
        }
    }

    /**
     * Create a new server
     */
    static async createServer(
        serverData: Omit<Server, 'id'>
    ): Promise<Server> {
        try {
            const response = await api.post<Server>('/servers/', serverData);
            return response.data;
        } catch (error) {
            console.error('Failed to create server:', error);
            throw new Error('Failed to create server. Please try again.');
        }
    }

    /**
     * Update an existing server
     */
    static async updateServer(
        id: string,
        serverData: Partial<Omit<Server, 'id'>>
    ): Promise<Server> {
        try {
            const response = await api.put<Server>(`/servers/${id}`, serverData);
            return response.data;
        } catch (error) {
            console.error(`Failed to update server ${id}:`, error);
            throw new Error('Failed to update server. Please try again.');
        }
    }

    /**
     * Delete a server
     */
    static async deleteServer(id: string): Promise<void> {
        try {
            await api.delete(`/servers/${id}`);
        } catch (error) {
            console.error(`Failed to delete server ${id}:`, error);
            throw new Error('Failed to delete server. Please try again.');
        }
    }
}
