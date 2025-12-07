"""
Server Management API Routes
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models import Server, ServerCreate, ServerUpdate
from app.database import db_client
import uuid

router = APIRouter(prefix='/servers', tags=['servers'])

@router.get('/', response_model=List[Server])
async def list_servers(
    status: Optional[str] = Query(None, description="Filter by status"),
    category: Optional[str] = Query(None, description="Filter by category")
):
    """
    List all servers with optional filtering
    
    - **status**: Filter by server status (online, offline, maintenance, warning)
    - **category**: Filter by category (production, staging, development, testing)
    """
    try:
        servers = await db_client.list_servers(status=status, category=category)
        return servers
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching servers: {str(e)}")

@router.post('/', response_model=Server, status_code=201)
async def create_server(server_data: ServerCreate):
    """
    Create a new server
    
    Generates a unique ID and stores the server in DynamoDB
    """
    try:
        # Generate unique ID
        server_id = f"srv-{str(uuid.uuid4())[:8]}"
        
        # Create Server instance with ID
        server = Server(id=server_id, **server_data.model_dump())
        
        # Save to database
        created_server = await db_client.create_server(server)
        return created_server
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating server: {str(e)}")

@router.get('/{server_id}', response_model=Server)
async def get_server(server_id: str):
    """
    Get server details by ID
    """
    try:
        server = await db_client.get_server(server_id)
        if not server:
            raise HTTPException(status_code=404, detail=f"Server {server_id} not found")
        return server
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching server: {str(e)}")

@router.put('/{server_id}', response_model=Server)
async def update_server(server_id: str, server_update: ServerUpdate):
    """
    Update server details
    
    Only provided fields will be updated
    """
    try:
        # Check if server exists
        existing_server = await db_client.get_server(server_id)
        if not existing_server:
            raise HTTPException(status_code=404, detail=f"Server {server_id} not found")
        
        # Get non-None fields
        updates = server_update.model_dump(exclude_unset=True)
        
        if not updates:
            return existing_server
        
        # Update server
        updated_server = await db_client.update_server(server_id, updates)
        return updated_server
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating server: {str(e)}")

@router.delete('/{server_id}', status_code=204)
async def delete_server(server_id: str):
    """
    Delete a server
    """
    try:
        # Check if server exists
        existing_server = await db_client.get_server(server_id)
        if not existing_server:
            raise HTTPException(status_code=404, detail=f"Server {server_id} not found")
        
        # Delete server
        await db_client.delete_server(server_id)
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting server: {str(e)}")
