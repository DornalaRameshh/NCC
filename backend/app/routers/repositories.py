"""
Version Control (Repository) Management API Routes
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models import Repository, RepositoryCreate, RepositoryUpdate
import uuid

router = APIRouter(prefix='/repositories', tags=['repositories'])

# In-memory storage (temporary)
_repos_store = {}

@router.get('/', response_model=List[Repository])
async def list_repositories(
    provider: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    visibility: Optional[str] = Query(None)
):
    """List all repositories with optional filtering"""
    try:
        repos = list(_repos_store.values())
        if provider:
            repos = [r for r in repos if r.provider == provider]
        if language:
            repos = [r for r in repos if r.language == language]
        if visibility:
            repos = [r for r in repos if r.visibility == visibility]
        return repos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/', response_model=Repository, status_code=201)
async def create_repository(repo_data: RepositoryCreate):
    """Create a new repository"""
    try:
        repo_id = f"repo-{str(uuid.uuid4())[:8]}"
        repo = Repository(id=repo_id, **repo_data.model_dump())
        _repos_store[repo_id] = repo
        return repo
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/{repo_id}', response_model=Repository)
async def get_repository(repo_id: str):
    """Get repository by ID"""
    repo = _repos_store.get(repo_id)
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")
    return repo

@router.put('/{repo_id}', response_model=Repository)
async def update_repository(repo_id: str, repo_update: RepositoryUpdate):
    """Update repository"""
    existing = _repos_store.get(repo_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Repository not found")
    
    updates = repo_update.model_dump(exclude_unset=True)
    updated_data = existing.model_dump()
    updated_data.update(updates)
    updated = Repository(**updated_data)
    _repos_store[repo_id] = updated
    return updated

@router.delete('/{repo_id}', status_code=204)
async def delete_repository(repo_id: str):
    """Delete repository"""
    if repo_id not in _repos_store:
        raise HTTPException(status_code=404, detail="Repository not found")
    del _repos_store[repo_id]
    return None
