# NCC Server Management Backend API

FastAPI-based backend for the NCC Management Application, providing RESTful APIs for server infrastructure management with AWS DynamoDB persistence.

## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, Delete servers
- **Advanced Filtering**: Query by status and category using DynamoDB GSIs
- **Data Validation**: Pydantic models ensure data integrity
- **Auto-generated Documentation**: Swagger UI and ReDoc
- **CORS Enabled**: Ready for frontend integration

## 📋 Prerequisites

- Python 3.13+
- AWS Account with DynamoDB access
- AWS credentials configured

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Create a `.env` file in the `backend/` directory:

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=ap-south-2
DYNAMODB_TABLE=NccServers
```

### 3. Create DynamoDB Table

```bash
python scripts/create_table.py
```

This creates the `NccServers` table with:
- **Partition Key**: `id` (String)
- **GSI_Category**: For filtering by category
- **GSI_Status**: For filtering by status

## 🏃 Running the Server

```bash
# Development mode (with auto-reload)
uvicorn app.main:app --reload --port 8000

# Or using Python
python -m uvicorn app.main:app --reload --port 8000
```

The API will be available at:
- **Base URL**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📡 API Endpoints

### Server Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/servers/` | List all servers (supports filtering) |
| `POST` | `/api/v1/servers/` | Create a new server |
| `GET` | `/api/v1/servers/{id}` | Get server by ID |
| `PUT` | `/api/v1/servers/{id}` | Update server |
| `DELETE` | `/api/v1/servers/{id}` | Delete server |

### Query Parameters

- `status`: Filter by server status (`online`, `offline`, `maintenance`, `warning`)
- `category`: Filter by category (`production`, `staging`, `development`, `testing`)

### Example Requests

#### Create Server
```bash
curl -X POST "http://localhost:8000/api/v1/servers/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "NCC-Core-Prod-01",
    "ipAddress": "192.168.1.10",
    "os": "Ubuntu 22.04 LTS",
    "specs": {
      "cpu": "8 vCPU",
      "ram": "32GB",
      "storage": "500GB SSD"
    },
    "location": "US-East-1",
    "provider": "AWS",
    "status": "online",
    "category": "production",
    "responsibleTeam": "DevOps",
    "lastPatchDate": "2024-12-07",
    "tags": ["web", "api"]
  }'
```

#### List Servers (Filtered)
```bash
# All production servers
curl "http://localhost:8000/api/v1/servers/?category=production"

# All servers in maintenance
curl "http://localhost:8000/api/v1/servers/?status=maintenance"
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
python scripts/test_api.py
```

This tests:
- ✅ Server creation
- ✅ Server retrieval
- ✅ Server updates
- ✅ Server deletion
- ✅ Filtering by status
- ✅ Filtering by category

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI application
│   ├── config.py        # Configuration & settings
│   ├── models.py        # Pydantic models
│   ├── database.py      # DynamoDB client
│   └── routers/
│       ├── __init__.py
│       └── servers.py   # Server endpoints
├── scripts/
│   ├── create_table.py  # DynamoDB table setup
│   └── test_api.py      # API test suite
├── .env                 # Environment variables (DO NOT COMMIT)
├── .gitignore
└── requirements.txt
```

## 🔐 Security Notes

- **Never commit `.env` files** to version control
- AWS credentials are loaded from `.env` during development
- For production, use IAM roles or AWS Secrets Manager

## 🌐 Integration with Frontend

The frontend React app (`http://localhost:5173`) is already configured in CORS origins. To connect:

1. Update frontend API base URL to `http://localhost:8000/api/v1`
2. Replace mock data imports with API calls
3. Use the same data models (TypeScript interfaces match Pydantic models)

## 📊 DynamoDB Schema

### Table: NccServers

**Primary Key:**
- `id` (String): Unique server identifier

**Attributes:**
- `name`, `ipAddress`, `os`, `location`, `provider`
- `specs_cpu`, `specs_ram`, `specs_storage`
- `status`, `category`, `responsibleTeam`, `lastPatchDate`
- `tags` (List)

**Global Secondary Indexes:**
1. **GSI_Category**
   - PK: `category`
   - SK: `name`
   - Enables efficient queries by environment type

2. **GSI_Status**
   - PK: `status`
   - Enables efficient queries by operational status

## 🐛 Troubleshooting

### "Table does not exist"
Run `python scripts/create_table.py` to create the DynamoDB table.

### "Unable to locate credentials"
Ensure your `.env` file has valid AWS credentials.

### CORS errors from frontend
Verify the frontend URL is in `config.py` CORS_ORIGINS list.

---

**Built with FastAPI, DynamoDB, and ❤️**
