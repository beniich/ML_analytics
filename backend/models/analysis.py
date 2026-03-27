import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error

def basic_statistics(df):
    return {
        "shape": df.shape,
        "columns": list(df.columns),
        "dtypes": df.dtypes.astype(str).to_dict(),
        "missing_values": df.isnull().sum().to_dict(),
        "basic_stats": df.describe().to_dict()
    }

def correlation_analysis(df):
    numeric_df = df.select_dtypes(include=[np.number])
    if numeric_df.empty:
        return {"error": "No numeric columns found"}
    
    correlation_matrix = numeric_df.corr().to_dict()
    return {"correlation_matrix": correlation_matrix}

def distribution_analysis(df):
    distributions = {}
    for column in df.select_dtypes(include=[np.number]).columns:
        distributions[column] = {
            "mean": float(df[column].mean()),
            "median": float(df[column].median()),
            "std": float(df[column].std()),
            "min": float(df[column].min()),
            "max": float(df[column].max())
        }
    return distributions

def predictive_modeling(df, target_column=None):
    if target_column is None:
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) < 2:
            return {"error": "Not enough numeric columns for prediction"}
        target_column = numeric_cols[-1]  # Dernière colonne numérique
    
    if target_column not in df.columns:
        return {"error": f"Target column '{target_column}' not found"}
    
    # Préparation des données
    X = df.drop(columns=[target_column]).select_dtypes(include=[np.number])
    y = df[target_column]
    
    if X.empty:
        return {"error": "No numeric features available"}
    
    # Impute missing values for simplicity
    X = X.fillna(X.mean())
    y = y.fillna(y.mean())
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Predictions
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    
    # Feature importance
    feature_importance = dict(zip(X.columns, model.feature_importances_))
    
    return {
        "mse": float(mse),
        "feature_importance": feature_importance,
        "model_type": "RandomForestRegressor"
    }
