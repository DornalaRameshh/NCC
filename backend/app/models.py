"""
Pydantic Models for Server and Domain Management
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

# ===== Domain Models =====

class DomainStatus(str, Enum):
    """Domain registration status"""
    active = 'active'
    expired = 'expired'
    pending_transfer = 'pending_transfer'
    grace_period = 'grace_period'

class SSLStatus(str, Enum):
    """SSL certificate status"""
    valid = 'valid'
    expired = 'expired'
    expiring_soon = 'expiring_soon'
    invalid = 'invalid'

class DNSRecordType(str, Enum):
    """DNS record types"""
    A = 'A'
    CNAME = 'CNAME'
    MX = 'MX'
    TXT = 'TXT'
    NS = 'NS'
    AAAA = 'AAAA'

class DNSRecord(BaseModel):
    """DNS Record model"""
    id: str
    type: DNSRecordType
    name: str
    value: str
    ttl: int

class SSLInfo(BaseModel):
    """SSL Certificate information"""
    issuer: str
    validFrom: str
    validTo: str
    status: SSLStatus

class DomainBase(BaseModel):
    """Base domain model"""
    name: str
    registrar: str
    registrationDate: str
    expiryDate: str
    autoRenew: bool
    owner: str
    status: DomainStatus
    ssl: Optional[SSLInfo] = None
    dnsRecords: List[DNSRecord] = []
    cost: Optional[float] = None

class DomainCreate(DomainBase):
    """Model for creating a new domain"""
    pass

class DomainUpdate(BaseModel):
    """Model for updating a domain (all fields optional)"""
    name: Optional[str] = None
    registrar: Optional[str] = None
    registrationDate: Optional[str] = None
    expiryDate: Optional[str] = None
    autoRenew: Optional[bool] = None
    owner: Optional[str] = None
    status: Optional[DomainStatus] = None
    ssl: Optional[SSLInfo] = None
    dnsRecords: Optional[List[DNSRecord]] = None
    cost: Optional[float] = None

class Domain(DomainBase):
    """Complete domain model with ID"""
    id: str

class DNSRecordCreate(BaseModel):
    """Model for adding a DNS record"""
    type: DNSRecordType
    name: str
    value: str
    ttl: int

class DNSRecordUpdate(BaseModel):
    """Model for updating a DNS record"""
    type: Optional[DNSRecordType] = None
    name: Optional[str] = None
    value: Optional[str] = None
    ttl: Optional[int] = None
