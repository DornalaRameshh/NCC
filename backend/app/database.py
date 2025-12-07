"""
DynamoDB Database Utilities
"""
import boto3
from boto3.dynamodb.conditions import Key, Attr
from typing import List, Optional, Dict, Any
from app.config import settings
from app.models import Server

class DynamoDBClient:
    """DynamoDB client wrapper"""
    
    def __init__(self):
        self.dynamodb = boto3.resource(
            'dynamodb',
            region_name=settings.AWS_DEFAULT_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )
        self.table = self.dynamodb.Table(settings.DYNAMODB_TABLE)
    
    def _serialize_server(self, server_dict: Dict[str, Any]) -> Dict[str, Any]:
        """Convert server model to DynamoDB format"""
        # Flatten specs
        serialized = {**server_dict}
        if 'specs' in serialized and isinstance(serialized['specs'], dict):
            serialized['specs_cpu'] = serialized['specs']['cpu']
            serialized['specs_ram'] = serialized['specs']['ram']
            serialized['specs_storage'] = serialized['specs']['storage']
            del serialized['specs']
        return serialized
    
    def _deserialize_server(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Convert DynamoDB item to server model format"""
        if not item:
            return item
        
        # Reconstruct specs
        deserialized = {**item}
        if 'specs_cpu' in deserialized:
            deserialized['specs'] = {
                'cpu': deserialized.pop('specs_cpu', ''),
                'ram': deserialized.pop('specs_ram', ''),
                'storage': deserialized.pop('specs_storage', '')
            }
        return deserialized
    
    async def get_server(self, server_id: str) -> Optional[Server]:
        """Get a server by ID"""
        try:
            response = self.table.get_item(Key={'id': server_id})
            item = response.get('Item')
            if item:
                return Server(**self._deserialize_server(item))
            return None
        except Exception as e:
            print(f"Error getting server: {e}")
            raise
    
    async def list_servers(
        self,
        status: Optional[str] = None,
        category: Optional[str] = None
    ) -> List[Server]:
        """List all servers with optional filtering"""
        try:
            # Use GSI if filtering by status or category
            if status:
                response = self.table.query(
                    IndexName='GSI_Status',
                    KeyConditionExpression=Key('status').eq(status)
                )
            elif category:
                response = self.table.query(
                    IndexName='GSI_Category',
                    KeyConditionExpression=Key('category').eq(category)
                )
            else:
                # Full scan if no filters
                response = self.table.scan()
            
            items = response.get('Items', [])
            return [Server(**self._deserialize_server(item)) for item in items]
        except Exception as e:
            print(f"Error listing servers: {e}")
            raise
    
    async def create_server(self, server: Server) -> Server:
        """Create a new server"""
        try:
            server_dict = server.model_dump()
            serialized = self._serialize_server(server_dict)
            
            self.table.put_item(Item=serialized)
            return server
        except Exception as e:
            print(f"Error creating server: {e}")
            raise
    
    async def update_server(self, server_id: str, updates: Dict[str, Any]) -> Optional[Server]:
        """Update an existing server"""
        try:
            # Build update expression
            update_expr = "SET "
            expr_attr_values = {}
            expr_attr_names = {}
            
            for key, value in updates.items():
                if value is not None:
                    if key == 'specs':
                        # Handle specs separately
                        expr_attr_names['#specs_cpu'] = 'specs_cpu'
                        expr_attr_names['#specs_ram'] = 'specs_ram'
                        expr_attr_names['#specs_storage'] = 'specs_storage'
                        expr_attr_values[':specs_cpu'] = value['cpu']
                        expr_attr_values[':specs_ram'] = value['ram']
                        expr_attr_values[':specs_storage'] = value['storage']
                        update_expr += "#specs_cpu = :specs_cpu, #specs_ram = :specs_ram, #specs_storage = :specs_storage, "
                    else:
                        attr_name = f"#{key}"
                        attr_value = f":{key}"
                        expr_attr_names[attr_name] = key
                        expr_attr_values[attr_value] = value
                        update_expr += f"{attr_name} = {attr_value}, "
            
            update_expr = update_expr.rstrip(', ')
            
            response = self.table.update_item(
                Key={'id': server_id},
                UpdateExpression=update_expr,
                ExpressionAttributeNames=expr_attr_names,
                ExpressionAttributeValues=expr_attr_values,
                ReturnValues='ALL_NEW'
            )
            
            updated_item = response.get('Attributes')
            if updated_item:
                return Server(**self._deserialize_server(updated_item))
            return None
        except Exception as e:
            print(f"Error updating server: {e}")
            raise
    
    async def delete_server(self, server_id: str) -> bool:
        """Delete a server"""
        try:
            self.table.delete_item(Key={'id': server_id})
            return True
        except Exception as e:
            print(f"Error deleting server: {e}")
            raise

# Singleton instance
db_client = DynamoDBClient()
