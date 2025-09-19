# CementAI Nexus - Setup Instructions

## Prerequisites

- Node.js 18+ (currently tested with v23.11.0)
- npm or yarn package manager
- Git
- Google Cloud Platform account (for production deployment)

## Quick Start (Demo Mode)

### 1. Clone and Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies  
cd frontend && npm install && cd ..
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
# For demo mode, the default values will work
```

### 3. Start the Application
```bash
# Start both backend and frontend in development mode
npm run dev

# Or start individually:
# Backend: npm run dev:backend
# Frontend: npm run dev:frontend
```

### 4. Access the Application
- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health

## Production Setup

### 1. Google Cloud Platform Setup

#### Create a New Project
```bash
# Install Google Cloud CLI
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

#### Enable Required APIs
```bash
gcloud services enable aiplatform.googleapis.com
gcloud services enable vision.googleapis.com
gcloud services enable bigquery.googleapis.com
gcloud services enable firebase.googleapis.com
```

#### Create Service Account
```bash
gcloud iam service-accounts create cementai-nexus \
    --description="CementAI Nexus Service Account" \
    --display-name="CementAI Nexus"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:cementai-nexus@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:cementai-nexus@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/bigquery.admin"

gcloud iam service-accounts keys create ./gcloud-key.json \
    --iam-account=cementai-nexus@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 2. Firebase Setup

#### Initialize Firebase
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init

# Select:
# - Hosting
# - Realtime Database
# - Functions (optional)
```

#### Configure Firebase
```bash
# Update firebase.json with your configuration
# Update database.rules.json for security
```

### 3. BigQuery Setup

#### Create Dataset
```bash
bq mk --dataset YOUR_PROJECT_ID:cement_plant_data
```

#### Create Tables
```bash
# Create sensor data table
bq mk --table YOUR_PROJECT_ID:cement_plant_data.sensor_readings \
    timestamp:TIMESTAMP,sensor_id:STRING,value:FLOAT,unit:STRING,location:STRING,sensor_type:STRING

# Create process parameters table
bq mk --table YOUR_PROJECT_ID:cement_plant_data.process_parameters \
    timestamp:TIMESTAMP,kiln_temperature:FLOAT,raw_mill_power:FLOAT,cement_mill_power:FLOAT,production_rate:FLOAT,energy_consumption:FLOAT

# Create quality metrics table
bq mk --table YOUR_PROJECT_ID:cement_plant_data.quality_metrics \
    timestamp:TIMESTAMP,sample_id:STRING,blaine_fineness:FLOAT,compressive_strength_3d:FLOAT,compressive_strength_28d:FLOAT,quality_score:FLOAT
```

### 4. Vertex AI Setup

#### Enable Vertex AI Workbench
```bash
gcloud notebooks instances create cementai-workbench \
    --location=us-central1-a \
    --machine-type=n1-standard-4 \
    --vm-image-project=deeplearning-platform-release \
    --vm-image-family=tf-ent-2-11-cu113 \
    --install-gpu-driver
```

#### Deploy ML Models
```bash
# Create model registry
gcloud ai models upload \
    --region=us-central1 \
    --display-name=energy-prediction-model \
    --container-image-uri=gcr.io/cloud-aiplatform/prediction/tf2-cpu.2-11:latest
```

### 5. Environment Variables

#### Production .env Configuration
```bash
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-actual-project-id
GOOGLE_APPLICATION_CREDENTIALS=./gcloud-key.json

# Firebase Configuration
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

# Vertex AI Configuration
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_ENDPOINT=your-vertex-endpoint

# Gemini API Configuration
GEMINI_API_KEY=your-gemini-api-key

# BigQuery Configuration
BIGQUERY_DATASET_ID=cement_plant_data

# Application Configuration
PORT=8080
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://api.your-domain.com
```

## Deployment Options

### Option 1: Google Cloud Run

#### Build and Deploy Backend
```bash
# Create Dockerfile for backend
cd backend

# Build and push to Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/cementai-backend

# Deploy to Cloud Run
gcloud run deploy cementai-backend \
    --image gcr.io/YOUR_PROJECT_ID/cementai-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```

#### Deploy Frontend to Firebase Hosting
```bash
cd frontend

# Build for production
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Option 2: Google Kubernetes Engine (GKE)

#### Create GKE Cluster
```bash
gcloud container clusters create cementai-cluster \
    --zone us-central1-a \
    --num-nodes 3 \
    --enable-autoscaling \
    --min-nodes 1 \
    --max-nodes 10
```

#### Deploy with Kubernetes
```bash
# Apply Kubernetes configurations
kubectl apply -f deploy/k8s/
```

### Option 3: Compute Engine

#### Create VM Instance
```bash
gcloud compute instances create cementai-vm \
    --zone=us-central1-a \
    --machine-type=e2-standard-4 \
    --image-family=ubuntu-2004-lts \
    --image-project=ubuntu-os-cloud \
    --boot-disk-size=50GB
```

#### Install and Configure
```bash
# SSH into the instance
gcloud compute ssh cementai-vm --zone=us-central1-a

# Install Node.js, PM2, and dependencies
# Clone repository and run setup
```

## Monitoring and Logging

### Google Cloud Monitoring
```bash
# Enable monitoring
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com
```

### Set up Alerts
```bash
# Create alerting policies for:
# - API response time > 2 seconds
# - Error rate > 5%
# - WebSocket connection drops
```

## Security Configuration

### API Security
```bash
# Set up Cloud Armor for DDoS protection
gcloud compute security-policies create cementai-security-policy

# Configure rate limiting
gcloud compute security-policies rules create 1000 \
    --security-policy cementai-security-policy \
    --expression "true" \
    --action "rate-based-ban" \
    --rate-limit-threshold-count 100 \
    --rate-limit-threshold-interval-sec 60
```

### Database Security
- Configure Firebase security rules
- Set up BigQuery IAM permissions
- Enable audit logging

## Backup and Recovery

### Database Backup
```bash
# Set up automated BigQuery exports
bq mk --transfer_config \
    --project_id=YOUR_PROJECT_ID \
    --data_source=scheduled_query \
    --display_name="Daily Backup Export" \
    --target_dataset=backup_dataset
```

### Application Backup
```bash
# Set up Cloud Storage for application backups
gsutil mb gs://cementai-backups
```

## Troubleshooting

### Common Issues

#### Backend Not Starting
```bash
# Check logs
npm run dev:backend
# Look for port conflicts, missing environment variables
```

#### Frontend Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### WebSocket Connection Issues
```bash
# Check firewall settings
# Verify CORS configuration
# Test with curl or Postman
```

#### Google Cloud API Errors
```bash
# Verify service account permissions
gcloud auth application-default login
# Check API quotas and billing
```

### Performance Optimization

#### Backend Optimization
- Enable compression middleware
- Implement Redis caching
- Use connection pooling for databases
- Set up load balancing

#### Frontend Optimization
- Enable code splitting
- Implement service workers
- Optimize bundle size
- Use CDN for static assets

### Scaling Considerations

#### Auto-scaling Configuration
- Set up horizontal pod autoscaling in GKE
- Configure Cloud Run concurrency settings
- Implement database connection pooling
- Use Cloud Load Balancer for traffic distribution

#### Monitoring Metrics
- API response times
- Database query performance
- WebSocket connection counts
- Error rates and exceptions

## Support and Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and rotate API keys quarterly
- Monitor cost and usage daily
- Backup configuration weekly

### Health Checks
- API endpoint availability
- Database connectivity
- AI service response times
- WebSocket functionality

### Updates and Patches
- Follow semantic versioning
- Test in staging environment
- Use blue-green deployment strategy
- Maintain rollback capabilities

## Contact and Support

For technical support or questions:
- Documentation: `/docs` folder
- Issues: GitHub repository issues
- Email: support@cementai-nexus.com
- Slack: #cementai-support channel