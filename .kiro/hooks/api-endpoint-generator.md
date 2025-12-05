---
name: "Generate API Endpoint"
description: "Create backend API endpoint with frontend integration"
trigger: "manual"
enabled: true
---

# Generate API Endpoint

Create a complete API endpoint with both backend and frontend integration.

## What to Generate

### Backend (backend/src/routes/)
1. Express route handler with proper error handling
2. Input validation
3. Authentication middleware if needed
4. Database operations (MongoDB)
5. Proper HTTP status codes and responses

### Frontend Integration
1. API call function with fetch
2. Error handling with try-catch
3. Loading states
4. TypeScript types for request/response
5. Integration example in relevant component

## Template Structure

**Backend:**
```javascript
// GET /api/[endpoint]
router.get('/[endpoint]', async (req, res) => {
  try {
    // Validation
    // Database query
    // Response
    res.json({ success: true, data })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: error.message })
  }
})
```

**Frontend:**
```typescript
const fetch[EndpointName] = async () => {
  try {
    const response = await fetch('https://geocities-reborn-production.up.railway.app/api/[endpoint]', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch:', error)
    throw error
  }
}
```

## Instructions

Ask for:
1. Endpoint name and HTTP method
2. What data it handles
3. Whether authentication is required
4. Where it should be integrated in the frontend
