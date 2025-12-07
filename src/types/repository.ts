export type RepoVisibility = 'public' | 'private' | 'internal';
export type CIStatus = 'passing' | 'failing' | 'pending' | 'none';

export interface Repository {
    id: string;
    name: string;
    url: string;
    provider: string;
    language: string;
    visibility: RepoVisibility;
    ownerTeam: string;
    ciStatus: CIStatus;
    lastCommit?: string;
    branches: number;
    openIssues: number;
}
