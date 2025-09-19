# CementAI Nexus API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
Currently using demo mode. In production, all endpoints would require proper authentication.

## Endpoints

### Health Check
```http
GET /health
```
Returns server status and connection information.

**Response:**
```json
{
  "success": true,
  "message": "CementAI Nexus API is running",
  "simulation_running": true,
  "connected_clients": 2,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Real-time Sensor Data
```http
GET /sensors/realtime
```
Get current sensor readings from all plant sensors.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2024-01-01T12:00:00.000Z",
      "sensor_id": "KILN_TEMP_01",
      "value": 1450.5,
      "unit": "°C",
      "location": "Kiln Burning Zone",
      "sensor_type": "temperature"
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Plant Status Overview
```http
GET /plant/status
```
Get overall plant operational status.

**Response:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-01-01T12:00:00.000Z",
    "overall_efficiency": 87.5,
    "production_rate_current": 1850,
    "production_rate_target": 2000,
    "energy_consumption_current": 95.2,
    "energy_consumption_target": 90.0,
    "quality_score_avg": 92.3,
    "active_alerts_count": 2,
    "equipment_running_count": 7,
    "equipment_total_count": 8,
    "environmental_compliance": true
  }
}
```

### Process Parameters
```http
GET /process/parameters
```
Get current process operational parameters.

**Response:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-01-01T12:00:00.000Z",
    "kiln_temperature": 1450.5,
    "kiln_pressure": -12.3,
    "raw_mill_power": 2850,
    "cement_mill_power": 3200,
    "production_rate": 1850,
    "energy_consumption": 95.2,
    "alternative_fuel_rate": 25.5,
    "raw_meal_flow": 2867.5,
    "cement_fineness": 365,
    "clinker_temperature": 1150,
    "exhaust_fan_speed": 495,
    "preheater_temperature": 350
  }
}
```

### Quality Metrics
```http
GET /quality/current
```
Get current quality control measurements.

**Response:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-01-01T12:00:00.000Z",
    "sample_id": "QS_1704110400000_123",
    "blaine_fineness": 365.2,
    "compressive_strength_3d": 22.5,
    "compressive_strength_28d": 48.2,
    "setting_time_initial": 65,
    "setting_time_final": 240,
    "quality_score": 92.3,
    "defect_count": 1,
    "consistency": 98.5,
    "chemical_composition": {
      "c3s": 58.2,
      "c2s": 18.5,
      "c3a": 10.1,
      "c4af": 10.2,
      "so3": 3.0,
      "free_lime": 0.8
    }
  }
}
```

### Equipment Status
```http
GET /equipment/status
```
Get status of all plant equipment.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "equipment_id": "KILN_01",
      "equipment_name": "Rotary Kiln #1",
      "status": "running",
      "operating_hours": 6850,
      "efficiency": 89.5,
      "last_maintenance": "2023-12-15T10:00:00.000Z",
      "next_maintenance": "2024-02-15T10:00:00.000Z",
      "alerts": [],
      "vibration_level": 2.1,
      "temperature": 65.2
    }
  ]
}
```

### Environmental Data
```http
GET /environmental/current
```
Get current environmental metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-01-01T12:00:00.000Z",
    "co2_emissions": 885.5,
    "nox_emissions": 650.2,
    "so2_emissions": 120.5,
    "dust_emissions": 22.1,
    "energy_consumption_specific": 95.2,
    "alternative_fuel_substitution": 25.5,
    "waste_heat_recovery": 64750,
    "water_consumption": 275.8
  }
}
```

### Complete Dashboard Data
```http
GET /dashboard/data
```
Get all dashboard data in a single request.

**Response:**
```json
{
  "success": true,
  "data": {
    "plant_overview": { /* Plant status data */ },
    "recent_sensors": [ /* Sensor readings array */ ],
    "current_parameters": { /* Process parameters */ },
    "recent_quality": [ /* Quality metrics array */ ],
    "equipment_status": [ /* Equipment status array */ ],
    "active_alerts": [ /* Active alerts array */ ],
    "ai_recommendations": [ /* AI recommendations array */ ],
    "environmental_data": { /* Environmental data */ }
  }
}
```

## AI Endpoints

### Chat with AI Assistant
```http
POST /ai/chat
```
Send a message to the AI assistant.

**Request Body:**
```json
{
  "message": "Why is energy consumption high today?",
  "dashboardData": { /* Optional: Current dashboard data for context */ }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Based on the current operational data, the elevated energy consumption is likely due to...",
    "confidence": 0.85,
    "recommendations": [
      "Reduce kiln temperature by 10-15°C",
      "Optimize air-to-fuel ratio",
      "Check raw meal composition"
    ],
    "context_used": ["plant_data", "process_parameters"]
  }
}
```

### Get AI Recommendations
```http
GET /ai/recommendations
```
Get AI-generated optimization recommendations.

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Top optimization opportunities: 1. Energy optimization...",
    "confidence": 0.88,
    "recommendations": [
      "Reduce kiln temperature by 10-15°C to 1435°C",
      "Increase alternative fuel rate to 30-35%",
      "Optimize cement mill power distribution"
    ],
    "context_used": ["plant_data", "environmental_metrics"]
  }
}
```

### Explain Anomaly
```http
POST /ai/explain-anomaly
```
Get AI explanation for detected anomalies.

**Request Body:**
```json
{
  "anomalyType": "high_temperature",
  "currentValue": 1485.5,
  "normalRange": "1430-1460°C"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "The elevated kiln temperature indicates...",
    "confidence": 0.92,
    "recommendations": [
      "Check raw meal analysis and adjust if needed",
      "Verify fuel quality and flow rates",
      "Monitor oxygen levels and adjust air flow"
    ],
    "context_used": ["plant_data", "historical_patterns"]
  }
}
```

## Simulation Control

### Start Simulation
```http
POST /simulation/start
```
Start the data simulation engine.

### Stop Simulation
```http
POST /simulation/stop
```
Stop the data simulation engine.

### Inject Anomaly
```http
POST /simulation/anomaly
```
Inject an anomaly for testing purposes.

**Request Body:**
```json
{
  "type": "temperature" // Options: temperature, power, quality, vibration
}
```

## WebSocket Events

### Connection
Connect to: `ws://localhost:3001`

### Events

#### dashboard_update
Broadcast every 5 seconds with complete dashboard data.

#### sensor_data
Real-time sensor readings.

#### process_data
Current process parameters.

#### alerts
Real-time alerts and anomalies.

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error description",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request
- `500`: Internal Server Error

## Rate Limiting

Currently no rate limiting in demo mode. Production deployment would implement:
- 100 requests per minute for dashboard endpoints
- 10 requests per minute for AI endpoints
- Unlimited WebSocket connections (with connection limits)

## Data Models

See `/data/models.ts` for complete TypeScript interface definitions.

## Testing

Use the provided Postman collection or curl commands:

```bash
# Health check
curl http://localhost:3001/api/health

# Get sensor data
curl http://localhost:3001/api/sensors/realtime

# Chat with AI
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How can we optimize energy consumption?"}'
```