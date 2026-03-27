import mlflow
import mlflow.sklearn
from datetime import datetime

# Configuration MLflow
# MLFLOW_TRACKING_URI = "http://localhost:5000"  # À adapter selon ton setup

def log_experiment(experiment_name, results):
    try:
        # mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
        with mlflow.start_run(run_name=f"{experiment_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"):
            # Log metrics
            if isinstance(results, dict):
                for key, value in flatten_dict(results).items():
                    if isinstance(value, (int, float)):
                        mlflow.log_metric(key, value)
            
            # Log parameters
            mlflow.log_param("experiment_type", experiment_name)
            mlflow.log_param("timestamp", datetime.now().isoformat())
    except Exception as e:
        print(f"Failed to log to MLflow: {e}")

def flatten_dict(d, parent_key='', sep='_'):
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)
