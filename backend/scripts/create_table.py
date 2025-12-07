"""
DynamoDB Table Creation Script for NCC Management
Creates all tables with Global Secondary Indexes
"""
import boto3
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from parent directory
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

def create_table(dynamodb, table_name, key_schema, attribute_defs, gsis=None):
    """Generic table creation function"""
    try:
        existing_tables = dynamodb.list_tables()['TableNames']
        if table_name in existing_tables:
            print(f"✓ Table '{table_name}' already exists")
            return
        
        print(f"Creating table '{table_name}'...")
        
        params = {
            'TableName': table_name,
            'KeySchema': key_schema,
            'AttributeDefinitions': attribute_defs,
            'ProvisionedThroughput': {'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
        }
        
        if gsis:
            params['GlobalSecondaryIndexes'] = gsis
        
        dynamodb.create_table(**params)
        
        waiter = dynamodb.get_waiter('table_exists')
        waiter.wait(TableName=table_name)
        print(f"✓ Table '{table_name}' created successfully!")
        
    except Exception as e:
        print(f"✗ Error creating {table_name}: {str(e)}")
        raise

def create_all_tables():
    """Create all NCC management tables"""
    dynamodb = boto3.client('dynamodb',
                            region_name=os.getenv('AWS_DEFAULT_REGION'),
                            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
    
    print("Creating NCC Management Tables...")
    print(f"Region: {os.getenv('AWS_DEFAULT_REGION')}\n")
    
    gsi_throughput = {'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
    
    # NccServers
    create_table(dynamodb, 'NccServers',
        [{'AttributeName': 'id', 'KeyType': 'HASH'}],
        [
            {'AttributeName': 'id', 'AttributeType': 'S'},
            {'AttributeName': 'category', 'AttributeType': 'S'},
            {'AttributeName': 'name', 'AttributeType': 'S'},
            {'AttributeName': 'status', 'AttributeType': 'S'}
        ],
        [
            {'IndexName': 'GSI_Category', 'KeySchema': [{'AttributeName': 'category', 'KeyType': 'HASH'}, {'AttributeName': 'name', 'KeyType': 'RANGE'}], 'Projection': {'ProjectionType': 'ALL'}, 'ProvisionedThroughput': gsi_throughput},
            {'IndexName': 'GSI_Status', 'KeySchema': [{'AttributeName': 'status', 'KeyType': 'HASH'}], 'Projection': {'ProjectionType': 'ALL'}, 'ProvisionedThroughput': gsi_throughput}
        ]
    )
    
    # NccDomains
    create_table(dynamodb, 'NccDomains',
        [{'AttributeName': 'id', 'KeyType': 'HASH'}],
        [
            {'AttributeName': 'id', 'AttributeType': 'S'},
            {'AttributeName': 'status', 'AttributeType': 'S'},
            {'AttributeName': 'expiryDate', 'AttributeType': 'S'},
            {'AttributeName': 'registrar', 'AttributeType': 'S'}
        ],
        [
            {'IndexName': 'GSI_Status', 'KeySchema': [{'AttributeName': 'status', 'KeyType': 'HASH'}, {'AttributeName': 'expiryDate', 'KeyType': 'RANGE'}], 'Projection': {'ProjectionType': 'ALL'}, 'ProvisionedThroughput': gsi_throughput},
            {'IndexName': 'GSI_Registrar', 'KeySchema': [{'AttributeName': 'registrar', 'KeyType': 'HASH'}], 'Projection': {'ProjectionType': 'ALL'}, 'ProvisionedThroughput': gsi_throughput}
        ]
    )
    
    # NccEmails
    create_table(dynamodb, 'NccEmails',
        [{'AttributeName': 'id', 'KeyType': 'HASH'}],
        [
            {'AttributeName': 'id', 'AttributeType': 'S'},
            {'AttributeName': 'status', 'AttributeType': 'S'},
            {'AttributeName': 'provider', 'AttributeType': 'S'}
        ],
        [
            {'IndexName': 'GSI_Status', 'KeySchema': [{'AttributeName': 'status', 'KeyType': 'HASH'}], 'Projection': {'ProjectionType': 'ALL'}, 'ProvisionedThroughput': gsi_throughput},
            {'IndexName': 'GSI_Provider', 'KeySchema': [{'AttributeName': 'provider', 'KeyType': 'HASH'}], 'Projection': {'ProjectionType': 'ALL'}, 'ProvisionedThroughput': gsi_throughput}
        ]
    )
    
    # NccRepositories
    create_table(dynamodb, 'NccRepositories',
        [{'AttributeName': 'id', 'KeyType': 'HASH'}],
        [
            {'AttributeName': 'id', 'AttributeType': 'S'},
            {'AttributeName': 'provider', 'AttributeType': 'S'},
            {'AttributeName': 'language', 'AttributeType': 'S'}
        ],
        [
            {'IndexName': 'GSI_Provider', 'KeySchema': [{'AttributeName': 'provider', 'KeyType': 'HASH'}], 'Projection': {'ProjectionType': 'ALL'}, 'ProvisionedThroughput': gsi_throughput},
            {'IndexName': 'GSI_Language', 'KeySchema': [{'AttributeName': 'language', 'KeyType': 'HASH'}], 'Projection': {'ProjectionType': 'ALL'}, 'ProvisionedThroughput': gsi_throughput}
        ]
    )
    
    # NccStorage
    create_table(dynamodb, 'NccStorage',
        [{'AttributeName': 'id', 'KeyType': 'HASH'}],
        [
            {'AttributeName': 'id', 'AttributeType': 'S'},
            {'AttributeName': 'provider', 'AttributeType': 'S'},
            {'AttributeName': 'type', 'AttributeType': 'S'}
        ],
        [
            {'IndexName': 'GSI_Provider', 'KeySchema': [{'AttributeName': 'provider', 'KeyType': 'HASH'}], 'Projection': {'ProjectionType': 'ALL'}, 'ProvisionedThroughput': gsi_throughput},
            {'IndexName': 'GSI_Type', 'KeySchema': [{'AttributeName': 'type', 'KeyType': 'HASH'}], 'Projection': {'ProjectionType': 'ALL'}, 'ProvisionedThroughput': gsi_throughput}
        ]
    )
    
    print("\n✅ All tables ready!")

if __name__ == '__main__':
    create_all_tables()
