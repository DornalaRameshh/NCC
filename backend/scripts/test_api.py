"""
API Test Script - Verify Server CRUD Operations
"""
import requests
import json
from typing import Dict, Any

BASE_URL = "http://localhost:8000/api/v1"

def print_response(response: requests.Response, title: str):
    """Pretty print response"""
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")

def test_api():
    """Test all server API endpoints"""
    
    # Test 1: Health Check
    print("\n🔍 Testing API Health...")
    response = requests.get("http://localhost:8000/health")
    print_response(response, "Health Check")
    
    # Test 2: Create a Server
    print("\n🔍 Testing CREATE Server...")
    new_server = {
        "name": "Test-Server-001",
        "ipAddress": "192.168.100.50",
        "os": "Ubuntu 22.04 LTS",
        "specs": {
            "cpu": "4 vCPU",
            "ram": "16GB",
            "storage": "250GB SSD"
        },
        "location": "ap-south-2",
        "provider": "AWS",
        "status": "online",
        "category": "testing",
        "responsibleTeam": "QA Team",
        "lastPatchDate": "2024-12-07",
        "tags": ["test", "api", "demo"]
    }
    
    response = requests.post(f"{BASE_URL}/servers/", json=new_server)
    print_response(response, "Create Server")
    
    if response.status_code == 201:
        created_server = response.json()
        server_id = created_server['id']
        print(f"\n✅ Server created with ID: {server_id}")
        
        # Test 3: Get Server by ID
        print("\n🔍 Testing GET Server by ID...")
        response = requests.get(f"{BASE_URL}/servers/{server_id}")
        print_response(response, f"Get Server {server_id}")
        
        # Test 4: Update Server
        print("\n🔍 Testing UPDATE Server...")
        updates = {
            "status": "maintenance",
            "responsibleTeam": "DevOps Team"
        }
        response = requests.put(f"{BASE_URL}/servers/{server_id}", json=updates)
        print_response(response, f"Update Server {server_id}")
        
        # Test 5: List All Servers
        print("\n🔍 Testing LIST All Servers...")
        response = requests.get(f"{BASE_URL}/servers/")
        print_response(response, "List All Servers")
        
        # Test 6: Filter by Status
        print("\n🔍 Testing FILTER by Status (maintenance)...")
        response = requests.get(f"{BASE_URL}/servers/?status=maintenance")
        print_response(response, "Filter by Status")
        
        # Test 7: Filter by Category
        print("\n🔍 Testing FILTER by Category (testing)...")
        response = requests.get(f"{BASE_URL}/servers/?category=testing")
        print_response(response, "Filter by Category")
        
        # Test 8: Delete Server
        print("\n🔍 Testing DELETE Server...")
        response = requests.delete(f"{BASE_URL}/servers/{server_id}")
        print_response(response, f"Delete Server {server_id}")
        
        # Test 9: Verify Deletion
        print("\n🔍 Verifying Deletion...")
        response = requests.get(f"{BASE_URL}/servers/{server_id}")
        print_response(response, "Get Deleted Server (should 404)")
    
    print(f"\n{'='*60}")
    print("✅ API Testing Complete!")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    try:
        test_api()
    except Exception as e:
        print(f"\n❌ Error during testing: {e}")
