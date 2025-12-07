"""
Seed Script - Populate all NCC tables with sample data
"""
import boto3
import os
from dotenv import load_dotenv
from pathlib import Path
from decimal import Decimal

env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

def get_dynamodb():
    return boto3.resource('dynamodb',
        region_name=os.getenv('AWS_DEFAULT_REGION'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )

def seed_emails():
    table = get_dynamodb().Table('NccEmails')
    emails = [
        {'id': 'email-001', 'email': 'admin@ncc-tech.com', 'displayName': 'Admin User', 'provider': 'Google Workspace', 'status': 'active', 'department': 'IT', 'quotaUsed': 2048, 'quotaLimit': 15360, 'createdDate': '2023-01-15'},
        {'id': 'email-002', 'email': 'devops@ncc-tech.com', 'displayName': 'DevOps Team', 'provider': 'Google Workspace', 'status': 'active', 'department': 'Engineering', 'quotaUsed': 5120, 'quotaLimit': 15360, 'createdDate': '2023-02-20'},
        {'id': 'email-003', 'email': 'support@ncc-tech.com', 'displayName': 'Support Team', 'provider': 'Zoho Mail', 'status': 'active', 'department': 'Support', 'quotaUsed': 1024, 'quotaLimit': 10240, 'createdDate': '2023-03-10'},
        {'id': 'email-004', 'email': 'old.user@ncc-tech.com', 'displayName': 'Old User', 'provider': 'Google Workspace', 'status': 'suspended', 'department': 'Sales', 'quotaUsed': 8192, 'quotaLimit': 15360, 'createdDate': '2022-06-01'},
    ]
    print(f"Seeding {len(emails)} emails...")
    for e in emails:
        table.put_item(Item=e)
        print(f"  ✓ {e['email']}")

def seed_repositories():
    table = get_dynamodb().Table('NccRepositories')
    repos = [
        {'id': 'repo-001', 'name': 'ncc-frontend', 'url': 'https://github.com/ncc/frontend', 'provider': 'GitHub', 'language': 'TypeScript', 'visibility': 'private', 'ownerTeam': 'Frontend', 'ciStatus': 'passing', 'branches': 5, 'openIssues': 3},
        {'id': 'repo-002', 'name': 'ncc-backend', 'url': 'https://github.com/ncc/backend', 'provider': 'GitHub', 'language': 'Python', 'visibility': 'private', 'ownerTeam': 'Backend', 'ciStatus': 'passing', 'branches': 8, 'openIssues': 7},
        {'id': 'repo-003', 'name': 'infra-configs', 'url': 'https://gitlab.com/ncc/infra', 'provider': 'GitLab', 'language': 'YAML', 'visibility': 'internal', 'ownerTeam': 'DevOps', 'ciStatus': 'failing', 'branches': 3, 'openIssues': 2},
        {'id': 'repo-004', 'name': 'mobile-app', 'url': 'https://github.com/ncc/mobile', 'provider': 'GitHub', 'language': 'Kotlin', 'visibility': 'private', 'ownerTeam': 'Mobile', 'ciStatus': 'pending', 'branches': 4, 'openIssues': 12},
        {'id': 'repo-005', 'name': 'docs', 'url': 'https://github.com/ncc/docs', 'provider': 'GitHub', 'language': 'Markdown', 'visibility': 'public', 'ownerTeam': 'All', 'ciStatus': 'none', 'branches': 1, 'openIssues': 0},
    ]
    print(f"Seeding {len(repos)} repositories...")
    for r in repos:
        table.put_item(Item=r)
        print(f"  ✓ {r['name']}")

def seed_storage():
    table = get_dynamodb().Table('NccStorage')
    storages = [
        {'id': 'storage-001', 'name': 'ncc-assets-prod', 'provider': 'AWS S3', 'type': 'object', 'region': 'ap-south-1', 'usageBytes': 53687091200, 'capacityBytes': 107374182400, 'createdDate': '2023-01-01', 'isPublic': False},
        {'id': 'storage-002', 'name': 'ncc-backups', 'provider': 'AWS S3', 'type': 'object', 'region': 'ap-south-1', 'usageBytes': 214748364800, 'capacityBytes': 536870912000, 'createdDate': '2022-06-15', 'isPublic': False},
        {'id': 'storage-003', 'name': 'client-files', 'provider': 'GCP Cloud Storage', 'type': 'object', 'region': 'asia-south1', 'usageBytes': 10737418240, 'capacityBytes': 53687091200, 'createdDate': '2023-04-20', 'isPublic': False},
        {'id': 'storage-004', 'name': 'ncc-db-volume', 'provider': 'AWS EBS', 'type': 'block', 'region': 'ap-south-1', 'usageBytes': 85899345920, 'capacityBytes': 107374182400, 'createdDate': '2023-02-10', 'isPublic': False},
    ]
    print(f"Seeding {len(storages)} storage items...")
    for s in storages:
        table.put_item(Item=s)
        print(f"  ✓ {s['name']}")

if __name__ == '__main__':
    print("Seeding NCC tables...\n")
    seed_emails()
    seed_repositories()
    seed_storage()
    print("\n✅ All data seeded!")
