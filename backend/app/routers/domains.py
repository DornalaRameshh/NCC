"""
Domain & DNS Management API Routes
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models import (
    Domain, DomainCreate, DomainUpdate,
    DNSRecord, DNSRecordCreate, DNSRecordUpdate
)
from app.db_helper import DynamoDBHelper
import uuid

router = APIRouter(prefix='/domains', tags=['domains'])
db = DynamoDBHelper('NccDomains')

@router.get('/', response_model=List[Domain])
async def list_domains(
    status: Optional[str] = Query(None, description="Filter by status"),
    registrar: Optional[str] = Query(None, description="Filter by registrar")
):
    """List all domains with optional filtering"""
    try:
        domains = db.scan()
        
        # Apply client-side filters
        if status:
            domains = [d for d in domains if d.get('status') == status]
        if registrar:
            domains = [d for d in domains if d.get('registrar') == registrar]
            
        return domains
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching domains: {str(e)}")

@router.post('/', response_model=Domain, status_code=201)
async def create_domain(domain_data: DomainCreate):
    """Create a new domain"""
    try:
        domain_id = f"dom-{str(uuid.uuid4())[:8]}"
        domain_dict = domain_data.model_dump()
        domain_dict['id'] = domain_id
        db.put_item(domain_dict)
        return domain_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating domain: {str(e)}")

@router.get('/{domain_id}', response_model=Domain)
async def get_domain(domain_id: str):
    """Get domain details by ID"""
    try:
        domain = db.get_item({'id': domain_id})
        if not domain:
            raise HTTPException(status_code=404, detail=f"Domain {domain_id} not found")
        return domain
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching domain: {str(e)}")

@router.put('/{domain_id}', response_model=Domain)
async def update_domain(domain_id: str, domain_update: DomainUpdate):
    """Update domain details"""
    try:
        existing = db.get_item({'id': domain_id})
        if not existing:
            raise HTTPException(status_code=404, detail=f"Domain {domain_id} not found")
        
        updates = domain_update.model_dump(exclude_unset=True)
        if not updates:
            return existing
        
        updated = db.update_item({'id': domain_id}, updates)
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating domain: {str(e)}")

@router.delete('/{domain_id}', status_code=204)
async def delete_domain(domain_id: str):
    """Delete a domain"""
    try:
        existing = db.get_item({'id': domain_id})
        if not existing:
            raise HTTPException(status_code=404, detail=f"Domain {domain_id} not found")
        
        db.delete_item({'id': domain_id})
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting domain: {str(e)}")

# DNS Record Management
@router.post('/{domain_id}/dns', response_model=Domain, status_code=201)
async def add_dns_record(domain_id: str, record_data: DNSRecordCreate):
    """Add a DNS record to a domain"""
    try:
        domain = db.get_item({'id': domain_id})
        if not domain:
            raise HTTPException(status_code=404, detail=f"Domain {domain_id} not found")
        
        record_id = f"dns-{str(uuid.uuid4())[:8]}"
        new_record = record_data.model_dump()
        new_record['id'] = record_id
        
        dns_records = domain.get('dnsRecords', [])
        dns_records.append(new_record)
        
        updated = db.update_item({'id': domain_id}, {'dnsRecords': dns_records})
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding DNS record: {str(e)}")

@router.put('/{domain_id}/dns/{record_id}', response_model=Domain)
async def update_dns_record(domain_id: str, record_id: str, record_update: DNSRecordUpdate):
    """Update a DNS record"""
    try:
        domain = db.get_item({'id': domain_id})
        if not domain:
            raise HTTPException(status_code=404, detail=f"Domain {domain_id} not found")
        
        dns_records = domain.get('dnsRecords', [])
        record_index = next((i for i, r in enumerate(dns_records) if r['id'] == record_id), None)
        
        if record_index is None:
            raise HTTPException(status_code=404, detail=f"DNS record {record_id} not found")
        
        updates = record_update.model_dump(exclude_unset=True)
        dns_records[record_index].update(updates)
        
        updated = db.update_item({'id': domain_id}, {'dnsRecords': dns_records})
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating DNS record: {str(e)}")

@router.delete('/{domain_id}/dns/{record_id}', response_model=Domain)
async def delete_dns_record(domain_id: str, record_id: str):
    """Delete a DNS record"""
    try:
        domain = db.get_item({'id': domain_id})
        if not domain:
            raise HTTPException(status_code=404, detail=f"Domain {domain_id} not found")
        
        dns_records = domain.get('dnsRecords', [])
        dns_records = [r for r in dns_records if r['id'] != record_id]
        
        updated = db.update_item({'id': domain_id}, {'dnsRecords': dns_records})
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting DNS record: {str(e)}")
