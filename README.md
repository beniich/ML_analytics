# AI ML Analytics Platform 🚀

This is a modular and scalable AI platform for automated data analysis, reporting, and predictive modeling.

## Features ✨

- **Multi-format Support**: Upload and analyze CSV, Excel, and JSON files. Support for SQL databases included.
- **Comprehensive Analysis**: Automatic generation of statistical summaries, correlations, and distribution insights.
- **Predictive Modeling**: Automated `RandomForestRegressor` with feature importance calculation.
- **Anomaly Detection**: Statistical identification of outliers using Z-score and IQR methods.
- **Smart Alerting**: Configurable email notifications for detected data anomalies or distribution shifts.
- **Dynamic Reporting**: Generation of professional HTML and PDF reports with templates.
- **High Performance**: Redis-based caching for frequent analysis requests.
- **Scalable Infrastructure**: MLflow integration for experiment tracking and model versioning.
- **Security**: Robust JWT-based authentication with a secure user registry.
- **Modern Dashboard**: Intuitive React frontend with real-time charting and interactive analytics.

## Tech Stack 🛠️

- **Backend**: FastAPI (Python), SQLAlchemy, Pandas, Scikit-learn.
- **Cache & Tracking**: Redis, MLflow.
- **Frontend**: React, Chart.js, Axios.
- **DevOps**: Docker & Docker Compose.

## How to Get Started 🏁

### Option 1: Docker (Recommended)

Run everything together with persistent storage and networking:

```bash
docker-compose up --build
```

- **Dashboard**: `http://localhost:3000`
- **FastAPI Docs**: `http://localhost:8000/docs`
- **MLflow Tracking**: `http://localhost:5000`

### Option 2: Manual Setup

1. **Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Directory Structure 📂

- `backend/`: Core logic, models, analysis functions, and API endpoints.
- `frontend/`: React application, UI components, and state management.
- `data/`: Sample datasets and persistent file storage.
- `reports/`: Generated PDF/HTML analysis reports.

## Testing 🧪

1. Register a user at `/users/register`.
2. Log in at `/users/login` to obtain your JWT token.
3. Upload a CSV file (e.g., `data/sample.csv`) to `/analysis/comprehensive`.
4. Configure email alerts at `/alerts/configure`.

---
Created with Antigravity 🦾
