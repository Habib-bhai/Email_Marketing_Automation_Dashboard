# API Documentation

**Version:** 1.0  
**Base URL:** `http://localhost:3000/api` (development) | `https://yourdomain.com/api` (production)  
**Last Updated:** January 2, 2026

---

## Table of Contents

1. [Authentication](#authentication)
2. [Common Response Formats](#common-response-formats)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [Ingest API](#ingest-api) - N8N Webhook Ingestion
6. [Dashboard API](#dashboard-api) - Metrics & Analytics
7. [Leads API](#leads-api) - Lead Management
8. [Campaigns API](#campaigns-api) - Campaign Management
9. [CORS Configuration](#cors-configuration)

---

## Authentication

**Current Status:** No authentication required (development mode)

**Future Implementation:**
```http
X-API-Key: your-api-key-here
```

**Example:**
```bash
curl -H "X-API-Key: abc123xyz" https://api.yourdomain.com/api/leads
```

---

## Common Response Formats

### Success Response

```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2026-01-02T10:30:00.000Z",
    "requestId": "req_abc123"
  }
}
```

### Error Response

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { ... },
  "timestamp": "2026-01-02T10:30:00.000Z"
}
```

### HTTP Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Missing or invalid authentication
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation failed
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## Error Handling

### Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Request validation failed | 400 |
| `NOT_FOUND` | Resource not found | 404 |
| `UNAUTHORIZED` | Authentication failed | 401 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `DATABASE_ERROR` | Database operation failed | 500 |
| `INTERNAL_ERROR` | Unexpected server error | 500 |

### Example Error Response

```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    "email is required",
    "email must be a valid email"
  ],
  "timestamp": "2026-01-02T10:30:00.000Z"
}
```

---

## Rate Limiting

**Limits:**
- **Ingest API:** 60 requests/minute per IP
- **Dashboard API:** 100 requests/minute per IP
- **Other APIs:** 30 requests/minute per IP

**Headers:**
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1704192600
```

**Rate Limit Exceeded Response:**
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "resetAt": "2026-01-02T10:31:00.000Z",
  "timestamp": "2026-01-02T10:30:00.000Z"
}
```

---

## Ingest API

### POST /api/ingest

Receive lead data from N8N webhooks.

**Purpose:** Ingest leads from N8N automation workflows and store in database.

**Endpoint:** `POST /api/ingest`

**Headers:**
```http
Content-Type: application/json
Origin: https://your-n8n-instance.n8n.cloud  # Required for CORS
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "company": "Acme Corp",
  "status": "Unprocessed",
  "type": "Brand",
  "temperature": "Hot",
  "source": "LinkedIn",
  "campaignId": "campaign-uuid-123",
  "metadata": {
    "customField": "value",
    "score": 85
  }
}
```

**Field Validation:**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `email` | string | ✅ Yes | Valid email, max 255 chars | Lead email address |
| `name` | string | ✅ Yes | Max 255 chars | Lead name |
| `company` | string | ❌ No | Max 255 chars | Company name |
| `status` | enum | ❌ No | "Processed" \| "Unprocessed" | Processing status (default: "Unprocessed") |
| `type` | enum | ❌ No | "Brand" \| "Apollo" \| "Cold" \| "Warm" | Lead type (default: "Cold") |
| `temperature` | enum | ❌ No | "Hot" \| "Warm" \| "Cold" | Lead temperature (default: "Cold") |
| `source` | string | ❌ No | Max 100 chars | Lead source (e.g., "LinkedIn", "Email") |
| `campaignId` | uuid | ❌ No | Valid UUID | Associated campaign ID |
| `metadata` | object | ❌ No | Valid JSON | Additional custom data |

**Success Response (201 Created):**
```json
{
  "data": {
    "id": "lead-uuid-456",
    "email": "john@example.com",
    "name": "John Doe",
    "company": "Acme Corp",
    "status": "Unprocessed",
    "type": "Brand",
    "temperature": "Hot",
    "source": "LinkedIn",
    "campaignId": "campaign-uuid-123",
    "metadata": {
      "customField": "value",
      "score": 85
    },
    "createdAt": "2026-01-02T10:30:00.000Z",
    "updatedAt": "2026-01-02T10:30:00.000Z"
  },
  "meta": {
    "timestamp": "2026-01-02T10:30:00.000Z"
  }
}
```

**Error Responses:**

**400 Bad Request** - Invalid email:
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": ["email must be a valid email"],
  "timestamp": "2026-01-02T10:30:00.000Z"
}
```

**409 Conflict** - Duplicate email:
```json
{
  "error": "Lead with this email already exists",
  "code": "DUPLICATE_EMAIL",
  "details": {
    "email": "john@example.com",
    "existingLeadId": "lead-uuid-789"
  },
  "timestamp": "2026-01-02T10:30:00.000Z"
}
```

**Example cURL:**
```bash
curl -X POST https://yourdomain.com/api/ingest \
  -H "Content-Type: application/json" \
  -H "Origin: https://your-n8n-instance.n8n.cloud" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "company": "Acme Corp",
    "status": "Unprocessed",
    "type": "Brand",
    "temperature": "Hot",
    "source": "LinkedIn"
  }'
```

**N8N Webhook Node Configuration:**
```json
{
  "method": "POST",
  "url": "https://yourdomain.com/api/ingest",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "email": "={{$json.email}}",
    "name": "={{$json.name}}",
    "company": "={{$json.company}}",
    "source": "N8N Workflow"
  }
}
```

---

## Dashboard API

### GET /api/dashboard/metrics

Get dashboard summary metrics.

**Endpoint:** `GET /api/dashboard/metrics`

**Query Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `dateFrom` | ISO date | ❌ No | Start date for metrics | `2026-01-01` |
| `dateTo` | ISO date | ❌ No | End date for metrics | `2026-01-31` |
| `refresh` | boolean | ❌ No | Bypass cache | `true` |

**Success Response (200 OK):**
```json
{
  "data": {
    "overview": {
      "totalLeads": 1250,
      "replyRate": 23.5,
      "enrichmentSuccess": 87.3,
      "activeWorkflows": 12
    },
    "trends": {
      "leadsChange": "+15.3%",
      "replyRateChange": "-2.1%",
      "enrichmentChange": "+5.8%",
      "workflowsChange": "0%"
    },
    "dateRange": {
      "from": "2026-01-01",
      "to": "2026-01-31"
    }
  },
  "meta": {
    "timestamp": "2026-01-02T10:30:00.000Z",
    "cached": false
  }
}
```

**Example cURL:**
```bash
curl "https://yourdomain.com/api/dashboard/metrics?dateFrom=2026-01-01&dateTo=2026-01-31"
```

---

### GET /api/dashboard/metrics/overview

Get detailed overview metrics.

**Endpoint:** `GET /api/dashboard/metrics/overview`

**Query Parameters:** Same as `/api/dashboard/metrics`

**Success Response (200 OK):**
```json
{
  "data": {
    "summary": {
      "totalLeads": 1250,
      "totalCampaigns": 8,
      "totalEmails": 5430,
      "totalReplies": 678,
      "replyRate": 12.49
    },
    "byStatus": {
      "Processed": 850,
      "Unprocessed": 400
    },
    "byType": {
      "Brand": 300,
      "Apollo": 450,
      "Cold": 350,
      "Warm": 150
    },
    "byTemperature": {
      "Hot": 200,
      "Warm": 550,
      "Cold": 500
    }
  },
  "meta": {
    "timestamp": "2026-01-02T10:30:00.000Z"
  }
}
```

---

### GET /api/dashboard/metrics/lead-pipeline

Get lead pipeline distribution data.

**Endpoint:** `GET /api/dashboard/metrics/lead-pipeline`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dateFrom` | ISO date | ❌ No | Start date |
| `dateTo` | ISO date | ❌ No | End date |
| `status` | enum | ❌ No | Filter by status: "Processed" \| "Unprocessed" |
| `type` | enum | ❌ No | Filter by type: "Brand" \| "Apollo" \| "Cold" \| "Warm" |

**Success Response (200 OK):**
```json
{
  "data": {
    "pipeline": [
      {
        "stage": "Brand",
        "count": 300,
        "percentage": 24.0
      },
      {
        "stage": "Apollo",
        "count": 450,
        "percentage": 36.0
      },
      {
        "stage": "Cold",
        "count": 350,
        "percentage": 28.0
      },
      {
        "stage": "Warm",
        "count": 150,
        "percentage": 12.0
      }
    ],
    "total": 1250
  },
  "meta": {
    "timestamp": "2026-01-02T10:30:00.000Z"
  }
}
```

**Example cURL:**
```bash
curl "https://yourdomain.com/api/dashboard/metrics/lead-pipeline?status=Processed&dateFrom=2026-01-01"
```

---

### GET /api/dashboard/metrics/email-engagement

Get email engagement metrics over time.

**Endpoint:** `GET /api/dashboard/metrics/email-engagement`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dateFrom` | ISO date | ❌ No | Start date |
| `dateTo` | ISO date | ❌ No | End date |
| `campaignId` | uuid | ❌ No | Filter by campaign |
| `interval` | enum | ❌ No | Time interval: "day" \| "week" \| "month" (default: "day") |

**Success Response (200 OK):**
```json
{
  "data": {
    "timeSeries": [
      {
        "date": "2026-01-01",
        "sent": 250,
        "opened": 180,
        "clicked": 45,
        "replied": 12,
        "bounced": 5,
        "openRate": 72.0,
        "clickRate": 18.0,
        "replyRate": 4.8
      },
      {
        "date": "2026-01-02",
        "sent": 280,
        "opened": 200,
        "clicked": 50,
        "replied": 15,
        "bounced": 3,
        "openRate": 71.4,
        "clickRate": 17.9,
        "replyRate": 5.4
      }
    ],
    "totals": {
      "sent": 5430,
      "opened": 3890,
      "clicked": 980,
      "replied": 678,
      "bounced": 125,
      "openRate": 71.6,
      "clickRate": 18.0,
      "replyRate": 12.5
    }
  },
  "meta": {
    "timestamp": "2026-01-02T10:30:00.000Z"
  }
}
```

**Example cURL:**
```bash
curl "https://yourdomain.com/api/dashboard/metrics/email-engagement?interval=week&dateFrom=2026-01-01"
```

---

## Leads API

### GET /api/dashboard/leads

Get paginated list of leads.

**Endpoint:** `GET /api/dashboard/leads`

**Query Parameters:**

| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| `page` | number | ❌ No | Page number (1-indexed) | 1 |
| `pageSize` | number | ❌ No | Items per page (max 100) | 50 |
| `status` | enum | ❌ No | Filter by status | - |
| `type` | enum | ❌ No | Filter by type | - |
| `temperature` | enum | ❌ No | Filter by temperature | - |
| `sortBy` | string | ❌ No | Sort field: "createdAt" \| "updatedAt" \| "name" \| "email" | "createdAt" |
| `sortOrder` | enum | ❌ No | Sort order: "asc" \| "desc" | "desc" |
| `search` | string | ❌ No | Search by name/email | - |

**Success Response (200 OK):**
```json
{
  "data": {
    "leads": [
      {
        "id": "lead-uuid-123",
        "email": "john@example.com",
        "name": "John Doe",
        "company": "Acme Corp",
        "status": "Processed",
        "type": "Brand",
        "temperature": "Hot",
        "source": "LinkedIn",
        "campaignId": "campaign-uuid-456",
        "createdAt": "2026-01-02T10:00:00.000Z",
        "updatedAt": "2026-01-02T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 50,
      "total": 1250,
      "totalPages": 25,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "meta": {
    "timestamp": "2026-01-02T10:30:00.000Z"
  }
}
```

**Example cURL:**
```bash
curl "https://yourdomain.com/api/dashboard/leads?page=1&pageSize=25&status=Processed&sortBy=createdAt&sortOrder=desc"
```

---

### GET /api/dashboard/leads/:id

Get a single lead by ID.

**Endpoint:** `GET /api/dashboard/leads/:id`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | uuid | Lead UUID |

**Success Response (200 OK):**
```json
{
  "data": {
    "id": "lead-uuid-123",
    "email": "john@example.com",
    "name": "John Doe",
    "company": "Acme Corp",
    "status": "Processed",
    "type": "Brand",
    "temperature": "Hot",
    "source": "LinkedIn",
    "campaignId": "campaign-uuid-456",
    "metadata": {
      "customField": "value"
    },
    "createdAt": "2026-01-02T10:00:00.000Z",
    "updatedAt": "2026-01-02T10:30:00.000Z",
    "engagement": {
      "emailsSent": 5,
      "emailsOpened": 3,
      "emailsClicked": 1,
      "emailsReplied": 1
    }
  },
  "meta": {
    "timestamp": "2026-01-02T10:30:00.000Z"
  }
}
```

**404 Not Found:**
```json
{
  "error": "Lead not found",
  "code": "NOT_FOUND",
  "timestamp": "2026-01-02T10:30:00.000Z"
}
```

**Example cURL:**
```bash
curl "https://yourdomain.com/api/dashboard/leads/lead-uuid-123"
```

---

### PATCH /api/dashboard/leads/:id

Update a lead.

**Endpoint:** `PATCH /api/dashboard/leads/:id`

**Request Body:**
```json
{
  "status": "Processed",
  "temperature": "Warm",
  "metadata": {
    "note": "Follow up next week"
  }
}
```

**Updatable Fields:**
- `status`, `type`, `temperature`, `source`, `campaignId`, `metadata`
- Cannot update: `id`, `email`, `createdAt`

**Success Response (200 OK):**
```json
{
  "data": {
    "id": "lead-uuid-123",
    "email": "john@example.com",
    "status": "Processed",
    "temperature": "Warm",
    "updatedAt": "2026-01-02T10:35:00.000Z"
  },
  "meta": {
    "timestamp": "2026-01-02T10:35:00.000Z"
  }
}
```

---

### DELETE /api/dashboard/leads/:id

Delete a lead.

**Endpoint:** `DELETE /api/dashboard/leads/:id`

**Success Response (200 OK):**
```json
{
  "data": {
    "deleted": true,
    "id": "lead-uuid-123"
  },
  "meta": {
    "timestamp": "2026-01-02T10:40:00.000Z"
  }
}
```

---

## Campaigns API

### GET /api/dashboard/campaigns

Get list of campaigns.

**Endpoint:** `GET /api/dashboard/campaigns`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | enum | ❌ No | Filter by status: "Draft" \| "Active" \| "Paused" \| "Completed" |
| `sortBy` | string | ❌ No | Sort field: "name" \| "startedAt" \| "createdAt" |
| `sortOrder` | enum | ❌ No | Sort order: "asc" \| "desc" |

**Success Response (200 OK):**
```json
{
  "data": {
    "campaigns": [
      {
        "id": "campaign-uuid-456",
        "name": "Q1 2026 Outreach",
        "status": "Active",
        "emailsSent": 1250,
        "repliesReceived": 156,
        "opensDetected": 890,
        "startedAt": "2026-01-01T00:00:00.000Z",
        "endedAt": null,
        "createdAt": "2025-12-28T10:00:00.000Z"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-01-02T10:30:00.000Z"
  }
}
```

---

### GET /api/dashboard/campaigns/:id

Get campaign details.

**Endpoint:** `GET /api/dashboard/campaigns/:id`

**Success Response (200 OK):**
```json
{
  "data": {
    "id": "campaign-uuid-456",
    "name": "Q1 2026 Outreach",
    "status": "Active",
    "emailsSent": 1250,
    "repliesReceived": 156,
    "opensDetected": 890,
    "startedAt": "2026-01-01T00:00:00.000Z",
    "endedAt": null,
    "metadata": {
      "description": "Cold outreach campaign"
    },
    "createdAt": "2025-12-28T10:00:00.000Z",
    "updatedAt": "2026-01-02T10:00:00.000Z",
    "leads": {
      "total": 500,
      "contacted": 400,
      "replied": 50
    }
  },
  "meta": {
    "timestamp": "2026-01-02T10:30:00.000Z"
  }
}
```

---

## CORS Configuration

**Allowed Origins:**
- **Development:** `http://localhost:3000`, `http://localhost:3001`, `http://127.0.0.1:3000`
- **Production:** Configured via `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_API_URL`
- **N8N:** Configured via `N8N_WEBHOOK_URL` and `N8N_INSTANCE_URL` (supports wildcards)

**Allowed Methods:** `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `OPTIONS`

**Allowed Headers:** `Content-Type`, `Authorization`, `X-Requested-With`, `X-API-Key`

**Credentials:** Allowed (cookies, auth headers)

**Preflight Cache:** 24 hours

**Example Preflight Request:**
```bash
curl -X OPTIONS https://yourdomain.com/api/leads \
  -H "Origin: https://your-app.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

**Response:**
```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://your-app.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-API-Key
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
Vary: Origin
```

---

## Postman Collection

Import this collection for easy testing:

```json
{
  "info": {
    "name": "Email Marketing Automation Dashboard API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api"
    }
  ],
  "item": [
    {
      "name": "Ingest Lead",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/ingest",
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"test@example.com\",\"name\":\"Test User\",\"type\":\"Brand\"}",
          "options": {"raw": {"language": "json"}}
        }
      }
    },
    {
      "name": "Get Dashboard Metrics",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/dashboard/metrics"
      }
    },
    {
      "name": "Get Leads",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/dashboard/leads?page=1&pageSize=10"
      }
    }
  ]
}
```

---

## Rate Limiting Details

### Implementation

Rate limiting uses IP-based tracking with in-memory storage:
- **Window:** 60 seconds
- **Ingest API:** 60 requests per window
- **Dashboard APIs:** 100 requests per window

### Bypass Rate Limiting (Development)

Set environment variable:
```bash
DISABLE_RATE_LIMIT=true
```

---

## Webhooks (Future)

**Coming Soon:** Outbound webhooks to notify external systems of events:
- `lead.created` - New lead ingested
- `lead.updated` - Lead status changed
- `campaign.completed` - Campaign finished
- `email.replied` - Email reply received

**Webhook Payload Example:**
```json
{
  "event": "lead.created",
  "timestamp": "2026-01-02T10:30:00.000Z",
  "data": {
    "id": "lead-uuid-123",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

---

## Support

- **Documentation:** https://yourdomain.com/docs
- **Issues:** https://github.com/yourusername/repo/issues
- **Email:** api-support@yourdomain.com

---

**API Version:** 1.0  
**Last Updated:** January 2, 2026
