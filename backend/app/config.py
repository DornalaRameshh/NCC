"""
Configuration and Settings for NCC Backend
"""
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # AWS Configuration
    AWS_ACCESS_KEY_ID: str = os.getenv('AWS_ACCESS_KEY_ID', '')
    AWS_SECRET_ACCESS_KEY: str = os.getenv('AWS_SECRET_ACCESS_KEY', '')
    AWS_DEFAULT_REGION: str = os.getenv('AWS_DEFAULT_REGION', 'ap-south-2')
    
    # DynamoDB
    DYNAMODB_TABLE: str = os.getenv('DYNAMODB_TABLE', 'NccServers')
    
    # API Configuration
    API_V1_PREFIX: str = '/api/v1'
    PROJECT_NAME: str = 'NCC Server Management API'
    VERSION: str = '1.0.0'
    
    # CORS
    CORS_ORIGINS: list = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173'
    ]

settings = Settings()
