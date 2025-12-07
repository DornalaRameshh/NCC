"""
DynamoDB Table Creation Script for NCC Server Management
Creates the NccServers table with Global Secondary Indexes for efficient querying
"""
import boto3
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from parent directory
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

def create_servers_table():
    """Create the NccServers table with GSIs"""
    
    # Initialize DynamoDB client
    dynamodb = boto3.client('dynamodb',
                            region_name=os.getenv('AWS_DEFAULT_REGION'),
                            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
    
    table_name = os.getenv('DYNAMODB_TABLE', 'NccServers')
    
    try:
        # Check if table already exists
        existing_tables = dynamodb.list_tables()['TableNames']
        if table_name in existing_tables:
            print(f"✓ Table '{table_name}' already exists")
            
            # Describe table to show details
            response = dynamodb.describe_table(TableName=table_name)
            table_status = response['Table']['TableStatus']
            print(f"  Status: {table_status}")
            print(f"  Region: {os.getenv('AWS_DEFAULT_REGION')}")
            return
        
        # Create table with GSIs
        print(f"Creating table '{table_name}'...")
        
        response = dynamodb.create_table(
            TableName=table_name,
            KeySchema=[
                {
                    'AttributeName': 'id',
                    'KeyType': 'HASH'  # Partition key
                }
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
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 5,
                        'WriteCapacityUnits': 5
                    }
                },
                {
                    'IndexName': 'GSI_Status',
                    'KeySchema': [
                        {'AttributeName': 'status', 'KeyType': 'HASH'}
                    ],
                    'Projection': {'ProjectionType': 'ALL'},
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 5,
                        'WriteCapacityUnits': 5
                    }
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        
        print(f"✓ Table creation initiated")
        print(f"  Waiting for table to become ACTIVE...")
        
        # Wait for table to be created
        waiter = dynamodb.get_waiter('table_exists')
        waiter.wait(TableName=table_name)
        
        # Verify table is active
        response = dynamodb.describe_table(TableName=table_name)
        table_status = response['Table']['TableStatus']
        
        print(f"\n✓ Table '{table_name}' created successfully!")
        print(f"  Status: {table_status}")
        print(f"  Region: {os.getenv('AWS_DEFAULT_REGION')}")
        print(f"  Partition Key: id (String)")
        print(f"  GSIs:")
        print(f"    - GSI_Category (PK: category, SK: name)")
        print(f"    - GSI_Status (PK: status)")
        
    except Exception as e:
        print(f"✗ Error creating table: {str(e)}")
        raise

if __name__ == '__main__':
    create_servers_table()
