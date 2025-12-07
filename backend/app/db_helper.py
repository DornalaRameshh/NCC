"""
DynamoDB Helper Functions
"""
import boto3
import os
from typing import List, Dict, Any, Optional
from decimal import Decimal
from botocore.exceptions import ClientError

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb',
    region_name=os.getenv('AWS_DEFAULT_REGION', 'ap-south-2'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

def python_to_dynamodb(obj: Any) -> Any:
    """Convert Python objects to DynamoDB compatible format"""
    if isinstance(obj, float):
        return Decimal(str(obj))
    elif isinstance(obj, dict):
        return {k: python_to_dynamodb(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [python_to_dynamodb(item) for item in obj]
    return obj

def dynamodb_to_python(obj: Any) -> Any:
    """Convert DynamoDB Decimal to Python float"""
    if isinstance(obj, Decimal):
        return float(obj) if obj % 1 else int(obj)
    elif isinstance(obj, dict):
        return {k: dynamodb_to_python(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [dynamodb_to_python(item) for item in obj]
    return obj

class DynamoDBHelper:
    """Helper class for DynamoDB operations"""
    
    def __init__(self, table_name: str):
        self.table = dynamodb.Table(table_name)
    
    def get_item(self, key: Dict[str, str]) -> Optional[Dict]:
        """Get a single item by key"""
        try:
            response = self.table.get_item(Key=key)
            if 'Item' in response:
                return dynamodb_to_python(response['Item'])
            return None
        except ClientError as e:
            print(f"Error getting item: {e}")
            raise
    
    def scan(self, filter_expression=None, expression_values=None) -> List[Dict]:
        """Scan table with optional filter"""
        try:
            params = {}
            if filter_expression and expression_values:
                params['FilterExpression'] = filter_expression
                params['ExpressionAttributeValues'] = python_to_dynamodb(expression_values)
            
            response = self.table.scan(**params)
            items = response.get('Items', [])
            
            # Handle pagination
            while 'LastEvaluatedKey' in response:
                params['ExclusiveStartKey'] = response['LastEvaluatedKey']
                response = self.table.scan(**params)
                items.extend(response.get('Items', []))
            
            return [dynamodb_to_python(item) for item in items]
        except ClientError as e:
            print(f"Error scanning table: {e}")
            raise
    
    def put_item(self, item: Dict) -> Dict:
        """Put an item into the table"""
        try:
            converted_item = python_to_dynamodb(item)
            self.table.put_item(Item=converted_item)
            return item
        except ClientError as e:
            print(f"Error putting item: {e}")
            raise
    
    def update_item(self, key: Dict[str, str], updates: Dict) -> Dict:
        """Update an item"""
        try:
            # Build update expression
            update_expr = "SET " + ", ".join([f"#{k} = :{k}" for k in updates.keys()])
            expr_names = {f"#{k}": k for k in updates.keys()}
            expr_values = {f":{k}": python_to_dynamodb(v) for k, v in updates.items()}
            
            response = self.table.update_item(
                Key=key,
                UpdateExpression=update_expr,
                ExpressionAttributeNames=expr_names,
                ExpressionAttributeValues=expr_values,
                ReturnValues="ALL_NEW"
            )
            return dynamodb_to_python(response['Attributes'])
        except ClientError as e:
            print(f"Error updating item: {e}")
            raise
    
    def delete_item(self, key: Dict[str, str]) -> None:
        """Delete an item"""
        try:
            self.table.delete_item(Key=key)
        except ClientError as e:
            print(f"Error deleting item: {e}")
            raise
    
    def query_by_gsi(self, index_name: str, key_condition_expression, expression_values: Dict) -> List[Dict]:
        """Query using a Global Secondary Index"""
        try:
            response = self.table.query(
                IndexName=index_name,
                KeyConditionExpression=key_condition_expression,
                ExpressionAttributeValues=python_to_dynamodb(expression_values)
            )
            items = response.get('Items', [])
            
            # Handle pagination
            while 'LastEvaluatedKey' in response:
                response = self.table.query(
                    IndexName=index_name,
                    KeyConditionExpression=key_condition_expression,
                    ExpressionAttributeValues=python_to_dynamodb(expression_values),
                    ExclusiveStartKey=response['LastEvaluatedKey']
                )
                items.extend(response.get('Items', []))
            
            return [dynamodb_to_python(item) for item in items]
        except ClientError as e:
            print(f"Error querying GSI: {e}")
            raise
