export type StorageType = 'object' | 'block' | 'file';

export interface StorageBucket {
    id: string;
    name: string;
    provider: string;
    type: StorageType;
    region: string;
    usageBytes: number;
    capacityBytes: number;
    createdDate: string;
    isPublic: boolean;
}
