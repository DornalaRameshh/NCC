"""
Storage Management API Routes
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models import StorageBucket, StorageCreate, StorageUpdate
import uuid

router = APIRouter(prefix='/storage', tags=['storage'])

# In-memory storage (temporary)
_storage_store = {}

@router.get('/', response_model=List[StorageBucket])
async def list_storage(
    provider: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    region: Optional[str] = Query(None)
):
    """List all storage buckets/volumes with optional filtering"""
    try:
        items = list(_storage_store.values())
        if provider:
            items = [s for s in items if s.provider == provider]
        if type:
            items = [s for s in items if s.type == type]
        if region:
            items = [s for s in items if s.region == region]
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/', response_model=StorageBucket, status_code=201)
async def create_storage(storage_data: StorageCreate):
    """Create a new storage bucket/volume"""
    try:
        storage_id = f"storage-{str(uuid.uuid4())[:8]}"
        from datetime import date
        storage = StorageBucket(
            id=storage_id,
            usageBytes=0,
            createdDate=str(date.today()),
            **storage_data.model_dump()
        )
        _storage_store[storage_id] = storage
        return storage
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/{storage_id}', response_model=StorageBucket)
async def get_storage(storage_id: str):
    """Get storage bucket by ID"""
    storage = _storage_store.get(storage_id)
    if not storage:
        raise HTTPException(status_code=404, detail="Storage not found")
    return storage

@router.put('/{storage_id}', response_model=StorageBucket)
async def update_storage(storage_id: str, storage_update: StorageUpdate):
    """Update storage bucket"""
    existing = _storage_store.get(storage_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Storage not found")
    
    updates = storage_update.model_dump(exclude_unset=True)
    updated_data = existing.model_dump()
    updated_data.update(updates)
    updated = StorageBucket(**updated_data)
    _storage_store[storage_id] = updated
    return updated

@router.delete('/{storage_id}', status_code=204)
async def delete_storage(storage_id: str):
    """Delete storage bucket"""
    if storage_id not in _storage_store:
        raise HTTPException(status_code=404, detail="Storage not found")
    del _storage_store[storage_id]
    return None
