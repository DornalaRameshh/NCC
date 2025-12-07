"""
Version Control (Repository) Management API Routes
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models import Repository, RepositoryCreate, RepositoryUpdate
from app.db_helper import DynamoDBHelper
import uuid

router = APIRouter(prefix='/repositories', tags=['repositories'])
db = DynamoDBHelper('NccRepositories')

@router.get('/', response_model=List[Repository])
async def list_repositories(
    provider: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    visibility: Optional[str] = Query(None)
):
    """List all repositories with optional filtering"""
    try:
        repos = db.scan()
        if provider:
            repos = [r for r in repos if r.get('provider') == provider]
        if language:
            repos = [r for r in repos if r.get('language') == language]
        if visibility:
            repos = [r for r in repos if r.get('visibility') == visibility]
        return repos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/', response_model=Repository, status_code=201)
async def create_repository(repo_data: RepositoryCreate):
    """Create a new repository"""
    try:
        repo_id = f"repo-{str(uuid.uuid4())[:8]}"
        repo_dict = repo_data.model_dump()
        repo_dict['id'] = repo_id
        if 'branches' not in repo_dict:
            repo_dict['branches'] = 1
        if 'openIssues' not in repo_dict:
            repo_dict['openIssues'] = 0
        db.put_item(repo_dict)
        return repo_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/{repo_id}', response_model=Repository)
async def get_repository(repo_id: str):
    """Get repository by ID"""
    repo = db.get_item({'id': repo_id})
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")
    return repo

@router.put('/{repo_id}', response_model=Repository)
async def update_repository(repo_id: str, repo_update: RepositoryUpdate):
    """Update repository"""
    existing = db.get_item({'id': repo_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Repository not found")
    
    updates = repo_update.model_dump(exclude_unset=True)
    updated = db.update_item({'id': repo_id}, updates)
    return updated

@router.delete('/{repo_id}', status_code=204)
async def delete_repository(repo_id: str):
    """Delete repository"""
    existing = db.get_item({'id': repo_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Repository not found")
    db.delete_item({'id': repo_id})
    return None
