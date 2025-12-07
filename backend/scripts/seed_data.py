"""
Seed Script - Populate DynamoDB with Initial Server Data
"""
import boto3
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

def seed_servers():
    """Seed the database with initial server data"""
    
    # Initialize DynamoDB resource
    dynamodb = boto3.resource('dynamodb',
                              region_name=os.getenv('AWS_DEFAULT_REGION'),
                              aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                              aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
    
    table_name = os.getenv('DYNAMODB_TABLE', 'NccServers')
    table = dynamodb.Table(table_name)
    
    # Sample server data
    servers = [
        {
            'id': 'srv-prod-001',
            'name': 'NCC-Core-Prod-01',
            'ipAddress': '192.168.1.10',
            'os': 'Ubuntu 22.04 LTS',
            'specs_cpu': '8 vCPU',
            'specs_ram': '32GB',
            'specs_storage': '500GB SSD',
            'location': 'US-East-1',
            'provider': 'AWS',
            'status': 'online',
            'category': 'production',
            'responsibleTeam': 'DevOps',
            'lastPatchDate': '2024-12-01',
            'tags': ['web', 'api', 'core'],
            'name': 'NCC-Core-Prod-01'  # For GSI sorting
        },
        {
            'id': 'srv-prod-002',
            'name': 'NCC-DB-Prod-01',
            'ipAddress': '192.168.1.15',
            'os': 'RHEL 9',
            'specs_cpu': '16 vCPU',
            'specs_ram': '64GB',
            'specs_storage': '1TB NVMe',
            'location': 'US-East-1',
            'provider': 'AWS',
            'status': 'online',
            'category': 'production',
            'responsibleTeam': 'DBA Team',
            'lastPatchDate': '2024-11-28',
            'tags': ['database', 'postgres', 'critical']
        },
        {
            'id': 'srv-stage-001',
            'name': 'NCC-Staging-Web',
            'ipAddress': '10.0.0.5',
            'os': 'Ubuntu 22.04 LTS',
            'specs_cpu': '4 vCPU',
            'specs_ram': '16GB',
            'specs_storage': '200GB SSD',
            'location': 'On-Prem',
            'provider': 'Internal',
            'status': 'warning',
            'category': 'staging',
            'responsibleTeam': 'QA Team',
            'lastPatchDate': '2024-11-15',
            'tags': ['frontend', 'testing']
        },
        {
            'id': 'srv-dev-001',
            'name': 'NCC-Dev-Build',
            'ipAddress': '10.0.0.20',
            'os': 'Windows Server 2022',
            'specs_cpu': '8 vCPU',
            'specs_ram': '32GB',
            'specs_storage': '1TB HDD',
            'location': 'On-Prem',
            'provider': 'Internal',
            'status': 'maintenance',
            'category': 'development',
            'responsibleTeam': 'DevOps',
            'lastPatchDate': '2024-10-20',
            'tags': ['jenkins', 'build', 'ci-cd']
        },
        {
            'id': 'srv-client-001',
            'name': 'Client-X-Dedicated',
            'ipAddress': '203.0.113.50',
            'os': 'CentOS 7',
            'specs_cpu': '4 vCPU',
            'specs_ram': '8GB',
            'specs_storage': '100GB SSD',
            'location': 'Europe-West',
            'provider': 'Azure',
            'status': 'offline',
            'category': 'production',
            'responsibleTeam': 'Client Support',
            'lastPatchDate': '2024-09-15',
            'tags': ['legacy', 'client-specific']
        }
    ]
    
    print(f"Seeding {len(servers)} servers into table '{table_name}'...")
    
    for server in servers:
        try:
            table.put_item(Item=server)
            print(f"  ✓ Added: {server['name']} ({server['id']})")
        except Exception as e:
            print(f"  ✗ Failed to add {server['name']}: {e}")
    
    print(f"\n✅ Seeding complete!")
    print(f"   Total servers: {len(servers)}")
    print(f"   Region: {os.getenv('AWS_DEFAULT_REGION')}")

if __name__ == '__main__':
    seed_servers()
