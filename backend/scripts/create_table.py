"""
DynamoDB Table Creation Script for NCC Management
Creates NccServers and NccDomains tables with Global Secondary Indexes
"""
import boto3
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from parent directory
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

def create_servers_table(dynamodb):
    """Create the NccServers table with GSIs"""
    table_name = 'NccServers'
    
    try:
        # Check if table already exists
        existing_tables = dynamodb.list_tables()['TableNames']
        if table_name in existing_tables:
            print(f"✓ Table '{table_name}' already exists")
            return
        
        # Create table with GSIs
        print(f"Creating table '{table_name}'...")
        
        dynamodb.create_table(
            TableName=table_name,
            KeySchema=[
                {'AttributeName': 'id', 'KeyType': 'HASH'}
            ],
            AttributeDefinitions=[
                {'AttributeName': 'id', 'AttributeType': 'S'},
                {'AttributeName': 'category', 'AttributeType': 'S'},
                {'AttributeName': 'name', 'AttributeType': 'S'},
                {'AttributeName': 'status', 'AttributeType': 'S'}
            ],
            GlobalSecondaryIndexes=[
                {
                    'IndexName': 'GSI_Category',
                    'KeySchema': [
                        {'AttributeName': 'category', 'KeyType': 'HASH'},
                        {'AttributeName': 'name', 'KeyType': 'RANGE'}
                    ],
                    'Projection': {'ProjectionType': 'ALL'},
                    'ProvisionedThroughput': {'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
                },
                {
                    'IndexName': 'GSI_Status',
                    'KeySchema': [{'AttributeName': 'status', 'KeyType': 'HASH'}],
                    'Projection': {'ProjectionType': 'ALL'},
                    'ProvisionedThroughput': {'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
                }
            ],
            ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
        )
        
        waiter = dynamodb.get_waiter('table_exists')
        waiter.wait(TableName=table_name)
        print(f"✓ Table '{table_name}' created successfully!")
        
    except Exception as e:
        print(f"✗ Error creating {table_name}: {str(e)}")
        raise

def create_domains_table(dynamodb):
    """Create the NccDomains table with GSIs"""
    table_name = 'NccDomains'
    
    try:
        # Check if table already exists
        existing_tables = dynamodb.list_tables()['TableNames']
        if table_name in existing_tables:
            print(f"✓ Table '{table_name}' already exists")
            return
        
        # Create table with GSIs
        print(f"Creating table '{table_name}'...")
        
        dynamodb.create_table(
            TableName=table_name,
            KeySchema=[
                {'AttributeName': 'id', 'KeyType': 'HASH'}
            ],
            AttributeDefinitions=[
                {'AttributeName': 'id', 'AttributeType': 'S'},
                {'AttributeName': 'status', 'AttributeType': 'S'},
                {'AttributeName': 'expiryDate', 'AttributeType': 'S'},
                {'AttributeName': 'registrar', 'AttributeType': 'S'}
            ],
            GlobalSecondaryIndexes=[
                {
                    'IndexName': 'GSI_Status',
                    'KeySchema': [
                        {'AttributeName': 'status', 'KeyType': 'HASH'},
                        {'AttributeName': 'expiryDate', 'KeyType': 'RANGE'}
                    ],
                    'Projection': {'ProjectionType': 'ALL'},
                    'ProvisionedThroughput': {'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
                },
                {
                    'IndexName': 'GSI_Registrar',
                    'KeySchema': [{'AttributeName': 'registrar', 'KeyType': 'HASH'}],
                    'Projection': {'ProjectionType': 'ALL'},
                    'ProvisionedThroughput': {'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
                }
            ],
            ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
        )
        
        waiter = dynamodb.get_waiter('table_exists')
        waiter.wait(TableName=table_name)
        print(f"✓ Table '{table_name}' created successfully!")
        
    except Exception as e:
        print(f"✗ Error creating {table_name}: {str(e)}")
        raise

if __name__ == '__main__':
    # Initialize DynamoDB client
    dynamodb = boto3.client('dynamodb',
                            region_name=os.getenv('AWS_DEFAULT_REGION'),
                            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
    
    print("Creating NCC Management Tables...")
    print(f"Region: {os.getenv('AWS_DEFAULT_REGION')}\n")
    
    create_servers_table(dynamodb)
    create_domains_table(dynamodb)
    
    print("\n✅ All tables ready!")
