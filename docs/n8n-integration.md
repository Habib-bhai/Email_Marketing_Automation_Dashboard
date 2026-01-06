# N8N Integration Guide

**Version:** 1.0  
**Last Updated:** January 2, 2026

Complete guide for integrating the Email Marketing Automation Dashboard with N8N automation workflows.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Webhook Configuration](#webhook-configuration)
5. [Workflow Templates](#workflow-templates)
6. [Authentication & Security](#authentication--security)
7. [Error Handling](#error-handling)
8. [Testing & Debugging](#testing--debugging)
9. [Advanced Use Cases](#advanced-use-cases)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)

---

## Overview

### What is N8N?

N8N is a powerful workflow automation tool that connects different services and automates tasks. This dashboard integrates with N8N to:

- **Ingest leads** from multiple sources (LinkedIn, email campaigns, CRMs)
- **Automate lead processing** with enrichment and scoring
- **Trigger email sequences** based on lead behavior
- **Sync data** between systems in real-time
- **Monitor campaign performance** with automatic alerts

### Integration Architecture

```
┌─────────────────┐
│  Lead Sources   │
│  (LinkedIn,     │
│   Email, CRM)   │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  N8N Workflows  │──┐
│  (Automation)   │  │
└────────┬────────┘  │
         │           │
         v           │
┌─────────────────┐  │
│  Dashboard API  │  │
│  /api/ingest    │  │
└────────┬────────┘  │
         │           │
         v           │
┌─────────────────┐  │
│   PostgreSQL    │  │
│   (Neon DB)     │  │
└────────┬────────┘  │
         │           │
         v           │
┌─────────────────┐  │
│   Dashboard UI  │<─┘
│  (Visualization)│
└─────────────────┘
```

---

## Prerequisites

### Required Software

- **N8N Instance:** Self-hosted or N8N Cloud (https://n8n.cloud)
- **Dashboard Running:** API accessible at `https://yourdomain.com/api`
- **PostgreSQL Database:** Neon or local PostgreSQL

### Required Credentials

1. **Dashboard API URL:**
   ```
   https://yourdomain.com/api/ingest
   ```

2. **N8N Webhook URL** (from N8N dashboard):
   ```
   https://your-n8n-instance.app.n8n.cloud/webhook/...
   ```

3. **CORS Configuration:** Dashboard must allow N8N origin (see [Authentication & Security](#authentication--security))

---

## Quick Start

### Step 1: Configure Environment Variables

Add to your dashboard `.env.local`:

```bash
# N8N Configuration
N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/lead-ingestion
N8N_INSTANCE_URL=https://your-n8n-instance.app.n8n.cloud
N8N_API_KEY=your-n8n-api-key  # Optional: for future authentication
```

### Step 2: Create Basic N8N Workflow

1. **Open N8N** and create a new workflow
2. **Add Webhook Node:**
   - Type: `POST`
   - Path: `lead-ingestion`
   - Response Mode: `On Received`

3. **Add HTTP Request Node:**
   - Method: `POST`
   - URL: `https://yourdomain.com/api/ingest`
   - Body Type: `JSON`
   - JSON Body:
     ```json
     {
       "email": "={{ $json.email }}",
       "name": "={{ $json.name }}",
       "company": "={{ $json.company }}",
       "type": "Cold",
       "temperature": "Cold",
       "source": "N8N Workflow"
     }
     ```

4. **Save & Activate** workflow

### Step 3: Test Integration

Send test webhook:

```bash
curl -X POST https://your-n8n-instance.app.n8n.cloud/webhook/lead-ingestion \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test Lead",
    "company": "Test Corp"
  }'
```

Check dashboard at `https://yourdomain.com/dashboard/leads` to verify lead appears.

---

## Webhook Configuration

### Webhook Node Setup

**Configuration:**
```json
{
  "node": "Webhook",
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "httpMethod": "POST",
    "path": "lead-ingestion",
    "responseMode": "onReceived",
    "responseData": "allEntries",
    "options": {
      "rawBody": false
    }
  }
}
```

**Expected Input:**
```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "company": "Acme Corp",
  "source": "LinkedIn"
}
```

### HTTP Request Node Setup

**Configuration:**
```json
{
  "node": "HTTP Request",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "POST",
    "url": "https://yourdomain.com/api/ingest",
    "authentication": "none",
    "requestFormat": "json",
    "jsonParameters": true,
    "bodyParameters": {
      "parameters": [
        {
          "name": "email",
          "value": "={{ $json.email }}"
        },
        {
          "name": "name",
          "value": "={{ $json.name }}"
        },
        {
          "name": "company",
          "value": "={{ $json.company }}"
        },
        {
          "name": "type",
          "value": "Cold"
        },
        {
          "name": "temperature",
          "value": "Cold"
        },
        {
          "name": "source",
          "value": "N8N Workflow"
        }
      ]
    },
    "options": {
      "timeout": 10000,
      "retry": {
        "enabled": true,
        "maxRetries": 3,
        "waitBetween": 1000
      }
    }
  }
}
```

---

## Workflow Templates

### Template 1: Basic Lead Ingestion

**Use Case:** Capture leads from any source and send to dashboard.

**Nodes:**
1. **Webhook** (trigger)
2. **HTTP Request** (send to dashboard)

**Download:** [basic-lead-ingestion.json](./workflows/basic-lead-ingestion.json)

**Workflow JSON:**
```json
{
  "name": "Basic Lead Ingestion",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "lead-ingestion",
        "responseMode": "onReceived"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://yourdomain.com/api/ingest",
        "jsonParameters": true,
        "options": {},
        "bodyParametersJson": "={{ JSON.stringify({\n  email: $json.email,\n  name: $json.name,\n  company: $json.company,\n  type: 'Cold',\n  temperature: 'Cold',\n  source: 'N8N Workflow'\n}) }}"
      },
      "name": "Send to Dashboard",
      "type": "n8n-nodes-base.httpRequest",
      "position": [450, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{"node": "Send to Dashboard", "type": "main", "index": 0}]]
    }
  }
}
```

---

### Template 2: LinkedIn Lead Enrichment

**Use Case:** Capture LinkedIn leads, enrich with Apollo, send to dashboard.

**Nodes:**
1. **Webhook** (LinkedIn lead)
2. **HTTP Request** (Apollo enrichment)
3. **Function** (parse Apollo data)
4. **HTTP Request** (send to dashboard)

**Download:** [linkedin-lead-enrichment.json](./workflows/linkedin-lead-enrichment.json)

**Key Features:**
- Validates email format
- Enriches with company data from Apollo
- Adds LinkedIn URL to metadata
- Sets lead type to "Brand" for verified companies

**Function Node (Parse Apollo Data):**
```javascript
// Parse Apollo enrichment response
const apolloData = $input.first().json;

return {
  email: apolloData.email,
  name: apolloData.name,
  company: apolloData.organization?.name || 'Unknown',
  type: apolloData.organization?.name ? 'Brand' : 'Cold',
  temperature: apolloData.email_verified ? 'Warm' : 'Cold',
  source: 'LinkedIn + Apollo',
  metadata: {
    linkedinUrl: $node["Webhook"].json.linkedin_url,
    apolloVerified: apolloData.email_verified,
    companyDomain: apolloData.organization?.domain
  }
};
```

---

### Template 3: Email Campaign Tracking

**Use Case:** Track email opens, clicks, replies and update dashboard.

**Nodes:**
1. **Webhook** (email event)
2. **Switch** (route by event type: open/click/reply)
3. **HTTP Request** (update lead in dashboard)

**Download:** [email-campaign-tracking.json](./workflows/email-campaign-tracking.json)

**Switch Node Logic:**
```javascript
// Route by email event type
const eventType = $json.event_type;

if (eventType === 'open') {
  return 0; // Route to "Update Open"
} else if (eventType === 'click') {
  return 1; // Route to "Update Click"
} else if (eventType === 'reply') {
  return 2; // Route to "Update Reply"
} else {
  return 3; // Route to "Unknown Event"
}
```

**Update Lead Node:**
```json
{
  "method": "PATCH",
  "url": "https://yourdomain.com/api/dashboard/leads/={{ $json.lead_id }}",
  "bodyParametersJson": "={{ JSON.stringify({\n  metadata: {\n    lastEmailOpened: new Date().toISOString(),\n    totalOpens: ($json.totalOpens || 0) + 1\n  },\n  temperature: 'Warm'\n}) }}"
}
```

---

### Template 4: Automated Lead Scoring

**Use Case:** Score leads based on engagement and enrich data.

**Nodes:**
1. **Webhook** (lead data)
2. **Function** (calculate score)
3. **IF** (route by score: Hot/Warm/Cold)
4. **HTTP Request** (send to dashboard with temperature)

**Download:** [automated-lead-scoring.json](./workflows/automated-lead-scoring.json)

**Scoring Function:**
```javascript
// Calculate lead score based on multiple factors
const lead = $input.first().json;

let score = 0;

// Company size bonus
if (lead.company_size > 100) score += 20;
else if (lead.company_size > 50) score += 10;

// Email verification
if (lead.email_verified) score += 15;

// Industry match
const targetIndustries = ['Technology', 'SaaS', 'Finance'];
if (targetIndustries.includes(lead.industry)) score += 25;

// LinkedIn engagement
if (lead.linkedin_connections > 500) score += 10;

// Previous engagement
if (lead.previous_email_opens > 0) score += 20;

// Determine temperature
let temperature;
if (score >= 60) temperature = 'Hot';
else if (score >= 30) temperature = 'Warm';
else temperature = 'Cold';

return {
  ...lead,
  score,
  temperature,
  metadata: {
    scoringDate: new Date().toISOString(),
    scoreBreakdown: {
      companySize: lead.company_size > 100 ? 20 : (lead.company_size > 50 ? 10 : 0),
      emailVerified: lead.email_verified ? 15 : 0,
      industryMatch: targetIndustries.includes(lead.industry) ? 25 : 0,
      linkedinEngagement: lead.linkedin_connections > 500 ? 10 : 0,
      previousEngagement: lead.previous_email_opens > 0 ? 20 : 0
    }
  }
};
```

---

### Template 5: Multi-Source Lead Aggregation

**Use Case:** Aggregate leads from multiple sources (LinkedIn, email, CRM) into one workflow.

**Nodes:**
1. **Webhook 1** (LinkedIn)
2. **Webhook 2** (Email)
3. **Webhook 3** (CRM)
4. **Merge** (combine all sources)
5. **Function** (normalize data)
6. **HTTP Request** (send to dashboard)

**Download:** [multi-source-aggregation.json](./workflows/multi-source-aggregation.json)

**Normalization Function:**
```javascript
// Normalize lead data from different sources
const lead = $input.first().json;
const source = lead.source || 'Unknown';

// Normalize field names
let normalized = {
  email: lead.email || lead.Email || lead.email_address,
  name: lead.name || lead.Name || lead.full_name || `${lead.first_name} ${lead.last_name}`,
  company: lead.company || lead.Company || lead.organization,
  source: source,
  metadata: {
    originalSource: source,
    importedAt: new Date().toISOString()
  }
};

// Source-specific logic
if (source === 'LinkedIn') {
  normalized.type = 'Brand';
  normalized.temperature = 'Warm';
  normalized.metadata.linkedinProfile = lead.profile_url;
} else if (source === 'Email') {
  normalized.type = 'Cold';
  normalized.temperature = 'Cold';
  normalized.metadata.emailCampaign = lead.campaign_id;
} else if (source === 'CRM') {
  normalized.type = lead.lead_type || 'Warm';
  normalized.temperature = lead.lead_temperature || 'Warm';
  normalized.metadata.crmId = lead.crm_id;
}

return normalized;
```

---

## Authentication & Security

### CORS Configuration

**Dashboard Configuration:**

Add N8N origins to `.env.local`:
```bash
# Allow N8N webhooks
N8N_INSTANCE_URL=https://your-n8n-instance.app.n8n.cloud

# Or use wildcard for N8N Cloud
N8N_INSTANCE_URL=https://*.app.n8n.cloud
```

**Supported Patterns:**
- Exact match: `https://my-instance.app.n8n.cloud`
- Wildcard subdomain: `https://*.app.n8n.cloud`
- Multiple instances: Comma-separated in `N8N_INSTANCE_URL`

### API Key Authentication (Future)

**Coming Soon:** Dashboard will support API key authentication.

**N8N Configuration:**
```json
{
  "authentication": "headerAuth",
  "headerAuth": {
    "name": "X-API-Key",
    "value": "={{ $env.DASHBOARD_API_KEY }}"
  }
}
```

**Dashboard `.env.local`:**
```bash
API_KEY_ENABLED=true
API_KEY_SECRET=your-secure-api-key
```

### Secure Webhook URLs

**Best Practices:**
- Use HTTPS for all webhook URLs
- Add random path suffix: `/webhook/lead-ingestion-abc123xyz`
- Rotate webhook URLs quarterly
- Monitor for unauthorized access

**Example Secure Webhook:**
```
https://your-n8n-instance.app.n8n.cloud/webhook/lead-ingestion-7k9m2pq5
```

---

## Error Handling

### Handling Dashboard API Errors

**Error Node Configuration:**
```json
{
  "node": "Error Handler",
  "type": "n8n-nodes-base.function",
  "parameters": {
    "functionCode": "const error = $input.first().json;\n\n// Log error details\nconsole.error('Dashboard API Error:', {\n  statusCode: error.statusCode,\n  message: error.message,\n  leadEmail: $node[\"Webhook\"].json.email\n});\n\n// Retry logic\nif (error.statusCode === 429) {\n  // Rate limit - wait and retry\n  return {\n    action: 'retry',\n    waitSeconds: 60\n  };\n} else if (error.statusCode >= 500) {\n  // Server error - retry\n  return {\n    action: 'retry',\n    waitSeconds: 30\n  };\n} else {\n  // Client error - log and skip\n  return {\n    action: 'skip',\n    reason: error.message\n  };\n}"
  }
}
```

### Retry Configuration

**HTTP Request Node Retry Settings:**
```json
{
  "options": {
    "retry": {
      "enabled": true,
      "maxRetries": 3,
      "waitBetween": 1000,
      "backoffStrategy": "exponential"
    },
    "timeout": 10000
  }
}
```

### Error Notifications

**Send Alert on Failure:**
```json
{
  "node": "Send Slack Alert",
  "type": "n8n-nodes-base.slack",
  "parameters": {
    "channel": "#alerts",
    "text": "🚨 Lead ingestion failed: {{ $json.error }}\nEmail: {{ $node[\"Webhook\"].json.email }}"
  }
}
```

---

## Testing & Debugging

### Test Workflow Locally

**1. Use N8N's Test Webhook:**
```bash
curl -X POST https://your-n8n-instance.app.n8n.cloud/webhook-test/lead-ingestion \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test Lead",
    "company": "Test Corp"
  }'
```

**2. Check N8N Execution Logs:**
- Go to N8N → Executions
- Click on latest execution
- Review each node's input/output

**3. Verify Dashboard:**
```bash
curl https://yourdomain.com/api/dashboard/leads?search=test@example.com
```

### Debug Mode

**Enable in Function Node:**
```javascript
// Enable debug logging
const DEBUG = true;

if (DEBUG) {
  console.log('Input data:', $input.first().json);
  console.log('Environment:', $env);
}

// ... rest of code
```

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| **CORS Error** | N8N origin not allowed | Add N8N URL to `N8N_INSTANCE_URL` in `.env.local` |
| **429 Too Many Requests** | Rate limit exceeded | Add retry logic or increase rate limit |
| **400 Validation Error** | Invalid email format | Validate email before sending |
| **500 Server Error** | Dashboard database down | Check database connection, retry |
| **Webhook not firing** | Workflow not active | Activate workflow in N8N |

---

## Advanced Use Cases

### Use Case 1: Conditional Lead Routing

**Scenario:** Route high-value leads to sales team, others to nurture sequence.

**Implementation:**
```javascript
// Score-based routing
const lead = $input.first().json;
const score = lead.metadata?.score || 0;

if (score >= 80) {
  // Send to CRM + notify sales
  return {
    ...lead,
    action: 'sales_notification',
    assignedTo: 'sales-team@company.com'
  };
} else if (score >= 50) {
  // Add to warm nurture sequence
  return {
    ...lead,
    action: 'nurture_sequence',
    sequence: 'warm_leads_14_day'
  };
} else {
  // Add to cold nurture sequence
  return {
    ...lead,
    action: 'nurture_sequence',
    sequence: 'cold_leads_30_day'
  };
}
```

---

### Use Case 2: Duplicate Detection

**Scenario:** Check if lead exists before creating duplicate.

**Implementation:**
```javascript
// Check for existing lead
const email = $input.first().json.email;

// Query dashboard API
const response = await fetch(`https://yourdomain.com/api/dashboard/leads?search=${email}`);
const data = await response.json();

if (data.data.leads.length > 0) {
  // Lead exists - update instead
  return {
    action: 'update',
    leadId: data.data.leads[0].id,
    ...$ input.first().json
  };
} else {
  // New lead - create
  return {
    action: 'create',
    ...$input.first().json
  };
}
```

---

### Use Case 3: Scheduled Lead Sync

**Scenario:** Sync leads from external CRM every hour.

**Nodes:**
1. **Cron** (trigger every hour)
2. **HTTP Request** (fetch from CRM)
3. **Split In Batches** (process 10 at a time)
4. **HTTP Request** (send to dashboard)

**Cron Configuration:**
```json
{
  "parameters": {
    "rule": {
      "interval": [
        {
          "field": "hours",
          "hoursInterval": 1
        }
      ]
    }
  }
}
```

---

## Troubleshooting

### Dashboard API Not Responding

**Symptoms:**
- N8N workflow hangs on HTTP Request node
- Timeout errors after 10 seconds

**Solutions:**
1. Check dashboard is running: `curl https://yourdomain.com/api/dashboard/metrics`
2. Verify database connection in dashboard logs
3. Check Redis is running: `curl $UPSTASH_REDIS_REST_URL/ping`
4. Increase timeout in N8N HTTP Request node to 30 seconds

---

### CORS Errors

**Symptoms:**
- Error: "Access-Control-Allow-Origin header is missing"
- Preflight OPTIONS request fails

**Solutions:**
1. Add N8N origin to `.env.local`:
   ```bash
   N8N_INSTANCE_URL=https://your-n8n-instance.app.n8n.cloud
   ```
2. Restart dashboard: `npm run dev`
3. Test preflight:
   ```bash
   curl -X OPTIONS https://yourdomain.com/api/ingest \
     -H "Origin: https://your-n8n-instance.app.n8n.cloud" \
     -H "Access-Control-Request-Method: POST"
   ```
4. Check response includes `Access-Control-Allow-Origin` header

---

### Rate Limiting Issues

**Symptoms:**
- 429 Too Many Requests errors
- Leads not ingesting during high traffic

**Solutions:**
1. **Increase rate limit** in dashboard (development only):
   ```bash
   DISABLE_RATE_LIMIT=true
   ```
2. **Add retry logic** in N8N:
   ```json
   {
     "retry": {
       "enabled": true,
       "maxRetries": 5,
       "waitBetween": 2000
     }
   }
   ```
3. **Batch requests** - use Split In Batches node to process 10 leads at a time
4. **Contact support** to increase production rate limits

---

### Webhook Not Triggering

**Symptoms:**
- Workflow shows "Waiting for webhook call"
- Test webhook works, but external calls don't

**Solutions:**
1. **Activate workflow:** Click "Active" toggle in N8N
2. **Use production webhook URL** (not test URL):
   ```
   https://your-n8n-instance.app.n8n.cloud/webhook/...
   # NOT: /webhook-test/...
   ```
3. **Check firewall rules** - ensure N8N can receive external traffic
4. **Verify webhook path** matches exactly (case-sensitive)

---

## Best Practices

### 1. Error Handling

✅ **DO:**
- Add Error Trigger node to catch failures
- Implement retry logic with exponential backoff
- Log errors to external monitoring (Slack, Sentry)
- Validate data before sending to dashboard

❌ **DON'T:**
- Ignore errors silently
- Retry indefinitely without backoff
- Send invalid data hoping dashboard will handle it

---

### 2. Performance Optimization

✅ **DO:**
- Use Split In Batches for large datasets (10-20 items per batch)
- Cache enrichment data when possible
- Process webhooks asynchronously
- Monitor workflow execution time

❌ **DON'T:**
- Process 1000+ leads in a single workflow execution
- Make synchronous calls to slow APIs
- Block webhook response while processing

---

### 3. Data Quality

✅ **DO:**
- Validate email format before ingestion
- Normalize company names (trim, lowercase)
- Deduplicate leads before sending
- Enrich data with additional context

❌ **DON'T:**
- Send leads with missing required fields
- Duplicate leads across workflows
- Ingest unvalidated user input

---

### 4. Security

✅ **DO:**
- Use environment variables for credentials
- Rotate webhook URLs quarterly
- Enable HTTPS for all endpoints
- Monitor for unauthorized access

❌ **DON'T:**
- Hardcode API keys in workflows
- Use HTTP for sensitive data
- Share webhook URLs publicly

---

### 5. Monitoring

✅ **DO:**
- Set up execution failure alerts
- Monitor daily ingestion volume
- Track API response times
- Review error logs weekly

❌ **DON'T:**
- Assume workflows are working without checking
- Ignore failed executions
- Skip logging important events

---

## Additional Resources

### Documentation
- **Dashboard API Docs:** [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)
- **N8N Docs:** https://docs.n8n.io
- **Webhook Node:** https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/

### Workflow Templates
- [Basic Lead Ingestion](./workflows/basic-lead-ingestion.json)
- [LinkedIn Enrichment](./workflows/linkedin-lead-enrichment.json)
- [Email Tracking](./workflows/email-campaign-tracking.json)
- [Lead Scoring](./workflows/automated-lead-scoring.json)
- [Multi-Source Aggregation](./workflows/multi-source-aggregation.json)

### Support
- **GitHub Issues:** https://github.com/yourusername/repo/issues
- **Email:** integrations@yourdomain.com
- **N8N Community:** https://community.n8n.io

---

**Last Updated:** January 2, 2026  
**Version:** 1.0  
**Maintained By:** Engineering Team
