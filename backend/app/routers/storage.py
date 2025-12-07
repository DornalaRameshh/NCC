"""
Storage Management API Routes
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models import StorageBucket, StorageCreate, StorageUpdate
from app.db_helper import DynamoDBHelper
import uuid
from datetime import date

router = APIRouter(prefix='/storage', tags=['storage'])
db = DynamoDBHelper('NccStorage')

@router.get('/', response_model=List[StorageBucket])
async def list_storage(
    provider: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    region: Optional[str] = Query(None)
):
    """List all storage buckets/volumes with optional filtering"""
    try:
        items = db.scan()
        if provider:
            items = [s for s in items if s.get('provider') == provider]
        if type:
            items = [s for s in items if s.get('type') == type]
        if region:
            items = [s for s in items if s.get('region') == region]
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/', response_model=StorageBucket, status_code=201)
async def create_storage(storage_data: StorageCreate):
    """Create a new storage bucket/volume"""
    try:
        storage_id = f"storage-{str(uuid.uuid4())[:8]}"
        storage_dict = storage_data.model_dump()
        storage_dict['id'] = storage_id
        storage_dict['usageBytes'] = 0
        storage_dict['createdDate'] = str(date.today())
        db.put_item(storage_dict)
        return storage_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/{storage_id}', response_model=StorageBucket)
async def get_storage(storage_id: str):
    """Get storage bucket by ID"""
    storage = db.get_item({'id': storage_id})
    if not storage:
        raise HTTPException(status_code=404, detail="Storage not found")
    return storage

@router.put('/{storage_id}', response_model=StorageBucket)
async def update_storage(storage_id: str, storage_update: StorageUpdate):
    """Update storage bucket"""
    existing = db.get_item({'id': storage_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Storage not found")
    
    updates = storage_update.model_dump(exclude_unset=True)
    updated = db.update_item({'id': storage_id}, updates)
    return updated

@router.delete('/{storage_id}', status_code=204)
async def delete_storage(storage_id: str):
    """Delete storage bucket"""
    existing = db.get_item({'id': storage_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Storage not found")
    db.delete_item({'id': storage_id})
    return None
