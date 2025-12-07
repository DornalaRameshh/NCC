"""
Pydantic Models for Server Management
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class ServerStatus(str, Enum):
    """Server operational status"""
    online = 'online'
    offline = 'offline'
    maintenance = 'maintenance'
    warning = 'warning'

class ServerCategory(str, Enum):
    """Server environment category"""
    production = 'production'
    staging = 'staging'
    development = 'development'
    testing = 'testing'

class ServerSpecs(BaseModel):
    """Server hardware specifications"""
    cpu: str
    ram: str
    storage: str

class ServerBase(BaseModel):
    """Base server model"""
    name: str
    ipAddress: str
    os: str
    specs: ServerSpecs
    location: str
    provider: str
    status: ServerStatus
    category: ServerCategory
    responsibleTeam: str
    lastPatchDate: str
    tags: List[str] = []

class ServerCreate(ServerBase):
    """Model for creating a new server"""
    pass

class ServerUpdate(BaseModel):
    """Model for updating a server (all fields optional)"""
    name: Optional[str] = None
    ipAddress: Optional[str] = None
    os: Optional[str] = None
    specs: Optional[ServerSpecs] = None
    location: Optional[str] = None
    provider: Optional[str] = None
    status: Optional[ServerStatus] = None
    category: Optional[ServerCategory] = None
    responsibleTeam: Optional[str] = None
    lastPatchDate: Optional[str] = None
    tags: Optional[List[str]] = None

class Server(ServerBase):
    """Complete server model with ID"""
    id: str

    class Config:
        json_schema_extra = {
            "example": {
                "id": "srv-001",
                "name": "NCC-Core-Prod-01",
                "ipAddress": "192.168.1.10",
                "os": "Ubuntu 22.04 LTS",
                "specs": {
                    "cpu": "8 vCPU",
                    "ram": "32GB",
                    "storage": "500GB SSD"
                },
                "location": "US-East-1",
                "provider": "AWS",
                "status": "online",
                "category": "production",
                "responsibleTeam": "DevOps",
                "lastPatchDate": "2023-10-15",
                "tags": ["web", "api"]
            }
        }
