"""
Seed Script - Populate DynamoDB with Initial Domain Data
"""
import boto3
import os
from dotenv import load_dotenv
from pathlib import Path
import json
from decimal import Decimal

# Load environment variables
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

def decimal_default(obj):
    """Convert floats to Decimal for DynamoDB"""
    if isinstance(obj, float):
        return Decimal(str(obj))
    raise TypeError

def seed_domains():
    """Seed the database with initial domain data"""
    
    # Initialize DynamoDB resource
    dynamodb = boto3.resource('dynamodb',
                              region_name=os.getenv('AWS_DEFAULT_REGION'),
                              aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                              aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
    
    table_name = 'NccDomains'
    table = dynamodb.Table(table_name)
    
    # Sample domain data
    domains = [
        {
            'id': 'dom-001',
            'name': 'ncc-tech.com',
            'registrar': 'GoDaddy',
            'registrationDate': '2020-05-15',
            'expiryDate': '2025-05-15',
            'autoRenew': True,
            'owner': 'Internal Product',
            'status': 'active',
            'ssl': {
                'issuer': "Let's Encrypt",
                'validFrom': '2023-11-01',
                'validTo': '2024-02-01',
                'status': 'valid'
            },
            'dnsRecords': [
                {'id': 'dns-1', 'type': 'A', 'name': '@', 'value': '192.168.1.10', 'ttl': 3600},
                {'id': 'dns-2', 'type': 'CNAME', 'name': 'www', 'value': 'ncc-tech.com', 'ttl': 3600},
                {'id': 'dns-3', 'type': 'MX', 'name': '@', 'value': 'smtp.google.com', 'ttl': 14400}
            ],
            'cost': 15.99
        },
        {
            'id': 'dom-002',
            'name': 'client-alpha.net',
            'registrar': 'Namecheap',
            'registrationDate': '2022-01-20',
            'expiryDate': '2025-01-20',
            'autoRenew': False,
            'owner': 'Client Alpha',
            'status': 'active',
            'ssl': {
                'issuer': 'DigiCert',
                'validFrom': '2023-01-20',
                'validTo': '2024-01-20',
                'status': 'expiring_soon'
            },
            'dnsRecords': [
                {'id': 'dns-4', 'type': 'A', 'name': '@', 'value': '203.0.113.50', 'ttl': 600}
            ],
            'cost': 12.50
        },
        {
            'id': 'dom-003',
            'name': 'legacy-project.org',
            'registrar': 'Bluehost',
            'registrationDate': '2018-03-10',
            'expiryDate': '2023-03-10',
            'autoRenew': False,
            'owner': 'Legacy Support',
            'status': 'expired',
            'ssl': {
                'issuer': 'None',
                'validFrom': '',
                'validTo': '',
                'status': 'invalid'
            },
            'dnsRecords': [],
            'cost': 18.00
        },
        {
            'id': 'dom-004',
            'name': 'ncc-staging.io',
            'registrar': 'AWS Route53',
            'registrationDate': '2023-06-01',
            'expiryDate': '2025-06-01',
            'autoRenew': True,
            'owner': 'DevOps Team',
            'status': 'active',
            'ssl': {
                'issuer': 'AWS ACM',
                'validFrom': '2023-06-01',
                'validTo': '2025-07-01',
                'status': 'valid'
            },
            'dnsRecords': [],
            'cost': 35.00
        }
    ]
    
    # Convert floats to Decimal for DynamoDB
    for domain in domains:
        if 'cost' in domain and domain['cost'] is not None:
            domain['cost'] = Decimal(str(domain['cost']))
    
    print(f"Seeding {len(domains)} domains into table '{table_name}'...")
    
    for domain in domains:
        try:
            table.put_item(Item=domain)
            print(f"  ✓ Added: {domain['name']} ({domain['id']})")
        except Exception as e:
            print(f"  ✗ Failed to add {domain['name']}: {e}")
    
    print(f"\n✅ Seeding complete!")
    print(f"   Total domains: {len(domains)}")
    print(f"   Region: {os.getenv('AWS_DEFAULT_REGION')}")

if __name__ == '__main__':
    seed_domains()
