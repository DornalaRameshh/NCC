"""
Email Solution Management API Routes
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models import EmailAccount, EmailCreate, EmailUpdate
import uuid

router = APIRouter(prefix='/emails', tags=['emails'])

# In-memory storage (temporary)
_emails_store = {}

@router.get('/', response_model=List[EmailAccount])
async def list_emails(
    status: Optional[str] = Query(None),
    provider: Optional[str] = Query(None),
    department: Optional[str] = Query(None)
):
    """List all email accounts with optional filtering"""
    try:
        emails = list(_emails_store.values())
        if status:
            emails = [e for e in emails if e.status == status]
        if provider:
            emails = [e for e in emails if e.provider == provider]
        if department:
            emails = [e for e in emails if e.department == department]
        return emails
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/', response_model=EmailAccount, status_code=201)
async def create_email(email_data: EmailCreate):
    """Create a new email account"""
    try:
        email_id = f"email-{str(uuid.uuid4())[:8]}"
        email = EmailAccount(id=email_id, quotaUsed=0, **email_data.model_dump())
        _emails_store[email_id] = email
        return email
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/{email_id}', response_model=EmailAccount)
async def get_email(email_id: str):
    """Get email account by ID"""
    email = _emails_store.get(email_id)
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    return email

@router.put('/{email_id}', response_model=EmailAccount)
async def update_email(email_id: str, email_update: EmailUpdate):
    """Update email account"""
    existing = _emails_store.get(email_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Email not found")
    
    updates = email_update.model_dump(exclude_unset=True)
    updated_data = existing.model_dump()
    updated_data.update(updates)
    updated = EmailAccount(**updated_data)
    _emails_store[email_id] = updated
    return updated

@router.delete('/{email_id}', status_code=204)
async def delete_email(email_id: str):
    """Delete email account"""
    if email_id not in _emails_store:
        raise HTTPException(status_code=404, detail="Email not found")
    del _emails_store[email_id]
    return None
