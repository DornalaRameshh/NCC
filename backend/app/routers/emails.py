"""
Email Solution Management API Routes
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models import EmailAccount, EmailCreate, EmailUpdate
from app.db_helper import DynamoDBHelper
import uuid

router = APIRouter(prefix='/emails', tags=['emails'])
db = DynamoDBHelper('NccEmails')

@router.get('/', response_model=List[EmailAccount])
async def list_emails(
    status: Optional[str] = Query(None),
    provider: Optional[str] = Query(None),
    department: Optional[str] = Query(None)
):
    """List all email accounts with optional filtering"""
    try:
        emails = db.scan()
        if status:
            emails = [e for e in emails if e.get('status') == status]
        if provider:
            emails = [e for e in emails if e.get('provider') == provider]
        if department:
            emails = [e for e in emails if e.get('department') == department]
        return emails
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/', response_model=EmailAccount, status_code=201)
async def create_email(email_data: EmailCreate):
    """Create a new email account"""
    try:
        email_id = f"email-{str(uuid.uuid4())[:8]}"
        email_dict = email_data.model_dump()
        email_dict['id'] = email_id
        email_dict['quotaUsed'] = 0
        db.put_item(email_dict)
        return email_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/{email_id}', response_model=EmailAccount)
async def get_email(email_id: str):
    """Get email account by ID"""
    email = db.get_item({'id': email_id})
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    return email

@router.put('/{email_id}', response_model=EmailAccount)
async def update_email(email_id: str, email_update: EmailUpdate):
    """Update email account"""
    existing = db.get_item({'id': email_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Email not found")
    
    updates = email_update.model_dump(exclude_unset=True)
    updated = db.update_item({'id': email_id}, updates)
    return updated

@router.delete('/{email_id}', status_code=204)
async def delete_email(email_id: str):
    """Delete email account"""
    existing = db.get_item({'id': email_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Email not found")
    db.delete_item({'id': email_id})
    return None
