"""
Domain & DNS Management API Routes
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models import (
    Domain, DomainCreate, DomainUpdate,
    DNSRecord, DNSRecordCreate, DNSRecordUpdate
)
import uuid

router = APIRouter(prefix='/domains', tags=['domains'])

# In-memory storage for demo (will be replaced with actual DB)
_domains_store = {}

@router.get('/', response_model=List[Domain])
async def list_domains(
    status: Optional[str] = Query(None, description="Filter by status"),
    registrar: Optional[str] = Query(None, description="Filter by registrar")
):
    """
    List all domains with optional filtering
    
    - **status**: Filter by domain status
    - **registrar**: Filter by registrar
    """
    try:
        # TODO: Implement actual DynamoDB queries
        domains = list(_domains_store.values())
        
        # Apply filters
        if status:
            domains = [d for d in domains if d.status == status]
        if registrar:
            domains = [d for d in domains if d.registrar == registrar]
            
        return domains
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching domains: {str(e)}")

@router.post('/', response_model=Domain, status_code=201)
async def create_domain(domain_data: DomainCreate):
    """
    Create a new domain
    
    Generates a unique ID and stores the domain
    """
    try:
        # Generate unique ID
        domain_id = f"dom-{str(uuid.uuid4())[:8]}"
        
        # Create Domain instance
        domain = Domain(id=domain_id, **domain_data.model_dump())
        
        # Store (temporary - will use DB)
        _domains_store[domain_id] = domain
        
        return domain
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating domain: {str(e)}")

@router.get('/{domain_id}', response_model=Domain)
async def get_domain(domain_id: str):
    """
    Get domain details by ID
    """
    try:
        # TODO: Fetch from DynamoDB
        domain = _domains_store.get(domain_id)
        
        if not domain:
            raise HTTPException(status_code=404, detail=f"Domain {domain_id} not found")
        return domain
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching domain: {str(e)}")

@router.put('/{domain_id}', response_model=Domain)
async def update_domain(domain_id: str, domain_update: DomainUpdate):
    """
    Update domain details
    
    Only provided fields will be updated
    """
    try:
        # TODO: Update in DynamoDB
        existing_domain = _domains_store.get(domain_id)
        
        if not existing_domain:
            raise HTTPException(status_code=404, detail=f"Domain {domain_id} not found")
        
        # Get non-None fields
        updates = domain_update.model_dump(exclude_unset=True)
        
        if not updates:
            return existing_domain
        
        # Apply updates
        updated_data = existing_domain.model_dump()
        updated_data.update(updates)
        updated_domain = Domain(**updated_data)
        
        _domains_store[domain_id] = updated_domain
        return updated_domain
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating domain: {str(e)}")

@router.delete('/{domain_id}', status_code=204)
async def delete_domain(domain_id: str):
    """
    Delete a domain
    """
    try:
        # TODO: Delete from DynamoDB
        if domain_id not in _domains_store:
            raise HTTPException(status_code=404, detail=f"Domain {domain_id} not found")
        
        del _domains_store[domain_id]
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting domain: {str(e)}")

# DNS Record Management
@router.post('/{domain_id}/dns', response_model=Domain, status_code=201)
async def add_dns_record(domain_id: str, record_data: DNSRecordCreate):
    """
    Add a DNS record to a domain
    """
    try:
        # TODO: Update in DynamoDB
        domain = _domains_store.get(domain_id)
        
        if not domain:
            raise HTTPException(status_code=404, detail=f"Domain {domain_id} not found")
        
        # Generate record ID
        record_id = f"dns-{str(uuid.uuid4())[:8]}"
        
        # Create DNS record
        new_record = DNSRecord(id=record_id, **record_data.model_dump())
        
        # Update domain
        updated_data = domain.model_dump()
        updated_data['dnsRecords'].append(new_record.model_dump())
        updated_domain = Domain(**updated_data)
        
        _domains_store[domain_id] = updated_domain
        return updated_domain
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding DNS record: {str(e)}")

@router.put('/{domain_id}/dns/{record_id}', response_model=Domain)
async def update_dns_record(domain_id: str, record_id: str, record_update: DNSRecordUpdate):
    """
    Update a DNS record
    """
    try:
        # TODO: Update in DynamoDB
        domain = _domains_store.get(domain_id)
        
        if not domain:
            raise HTTPException(status_code=404, detail=f"Domain {domain_id} not found")
        
        # Find record
        record_index = next((i for i, r in enumerate(domain.dnsRecords) if r.id == record_id), None)
        
        if record_index is None:
            raise HTTPException(status_code=404, detail=f"DNS record {record_id} not found")
        
        # Update record
        updated_data = domain.model_dump()
        record_dict = updated_data['dnsRecords'][record_index]
        updates = record_update.model_dump(exclude_unset=True)
        record_dict.update(updates)
        
        updated_domain = Domain(**updated_data)
        _domains_store[domain_id] = updated_domain
        return updated_domain
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating DNS record: {str(e)}")

@router.delete('/{domain_id}/dns/{record_id}',response_model=Domain)
async def delete_dns_record(domain_id: str, record_id: str):
    """
    Delete a DNS record
    """
    try:
        # TODO: Update in DynamoDB
        domain = _domains_store.get(domain_id)
        
        if not domain:
            raise HTTPException(status_code=404, detail=f"Domain {domain_id} not found")
        
        # Filter out the record
        updated_data = domain.model_dump()
        updated_data['dnsRecords'] = [r for r in updated_data['dnsRecords'] if r['id'] != record_id]
        
        updated_domain = Domain(**updated_data)
        _domains_store[domain_id] = updated_domain
        return updated_domain
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting DNS record: {str(e)}")
