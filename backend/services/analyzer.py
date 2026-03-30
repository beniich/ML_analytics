"""
Data analysis module with comprehensive analytics functions
"""
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, accuracy_score, precision_score, recall_score
from scipy import stats
from typing import Dict, Any, Tuple, List
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class DataAnalyzer:
    """Main class for data analysis operations"""
    
    def __init__(self, dataframe: pd.DataFrame):
        self.df = dataframe
        self.numeric_cols = self.df.select_dtypes(include=[np.number]).columns.tolist()
        self.categorical_cols = self.df.select_dtypes(include=['object']).columns.tolist()
        self.analysis_timestamp = datetime.now()
    
    def basic_statistics(self) -> Dict[str, Any]:
        """Generate basic statistical summary"""
        try:
            return {
                "shape": {"rows": self.df.shape[0], "columns": self.df.shape[1]},
                "columns": list(self.df.columns),
                "dtypes": self.df.dtypes.astype(str).to_dict(),
                "missing_values": self.df.isnull().sum().to_dict(),
                "duplicates": int(self.df.duplicated().sum()),
                "memory_usage_mb": float(self.df.memory_usage(deep=True).sum() / 1024**2),
                "basic_stats": {
                    col: {
                        "mean": float(self.df[col].mean()) if pd.api.types.is_numeric_dtype(self.df[col]) else "N/A",
                        "median": float(self.df[col].median()) if pd.api.types.is_numeric_dtype(self.df[col]) else "N/A",
                        "std": float(self.df[col].std()) if pd.api.types.is_numeric_dtype(self.df[col]) else "N/A",
                        "min": float(self.df[col].min()) if pd.api.types.is_numeric_dtype(self.df[col]) else "N/A",
                        "max": float(self.df[col].max()) if pd.api.types.is_numeric_dtype(self.df[col]) else "N/A",
                        "unique_values": int(self.df[col].nunique())
                    }
                    for col in self.df.columns
                }
            }
        except Exception as e:
            logger.error(f"Error in basic_statistics: {str(e)}")
            return {"error": str(e)}
    
    def correlation_analysis(self) -> Dict[str, Any]:
        """Analyze correlation between numeric columns"""
        try:
            if not self.numeric_cols:
                return {"error": "No numeric columns found"}
            
            numeric_df = self.df[self.numeric_cols]
            correlation_matrix = numeric_df.corr().to_dict()
            
            # Find high correlations
            corr_pairs = []
            for i in range(len(numeric_df.columns)):
                for j in range(i+1, len(numeric_df.columns)):
                    col1 = numeric_df.columns[i]
                    col2 = numeric_df.columns[j]
                    corr_value = numeric_df[col1].corr(numeric_df[col2])
                    if abs(corr_value) > 0.7:  # High correlation threshold
                        corr_pairs.append({
                            "variables": [col1, col2],
                            "correlation": float(corr_value)
                        })
            
            return {
                "correlation_matrix": correlation_matrix,
                "high_correlations": corr_pairs
            }
        except Exception as e:
            logger.error(f"Error in correlation_analysis: {str(e)}")
            return {"error": str(e)}
    
    def distribution_analysis(self) -> Dict[str, Any]:
        """Analyze distribution of numeric columns"""
        try:
            distributions = {}
            for column in self.numeric_cols:
                data = self.df[column].dropna()
                
                # Calculate skewness and kurtosis
                skewness = float(stats.skew(data))
                kurtosis = float(stats.kurtosis(data))
                
                distributions[column] = {
                    "mean": float(data.mean()),
                    "median": float(data.median()),
                    "mode": float(data.mode()[0]) if len(data.mode()) > 0 else None,
                    "std": float(data.std()),
                    "variance": float(data.var()),
                    "min": float(data.min()),
                    "max": float(data.max()),
                    "q1": float(data.quantile(0.25)),
                    "q3": float(data.quantile(0.75)),
                    "skewness": skewness,
                    "kurtosis": kurtosis,
                    "range": float(data.max() - data.min())
                }
            
            return distributions
        except Exception as e:
            logger.error(f"Error in distribution_analysis: {str(e)}")
            return {"error": str(e)}
    
    def missing_value_analysis(self) -> Dict[str, Any]:
        """Detailed analysis of missing values"""
        try:
            missing_stats = {}
            for col in self.df.columns:
                missing_count = self.df[col].isnull().sum()
                missing_percent = (missing_count / len(self.df)) * 100
                
                if missing_count > 0:
                    missing_stats[col] = {
                        "missing_count": int(missing_count),
                        "missing_percent": float(missing_percent),
                        "non_missing_count": int(len(self.df) - missing_count)
                    }
            
            return missing_stats if missing_stats else {"message": "No missing values found"}
        except Exception as e:
            logger.error(f"Error in missing_value_analysis: {str(e)}")
            return {"error": str(e)}
    
    def predictive_modeling(self, target_column: str = None, model_type: str = "regression") -> Dict[str, Any]:
        """Train a predictive model"""
        try:
            if target_column is None:
                if not self.numeric_cols or len(self.numeric_cols) < 2:
                    return {"error": "Not enough numeric columns for prediction"}
                target_column = self.numeric_cols[-1]
            
            if target_column not in self.df.columns:
                return {"error": f"Target column '{target_column}' not found"}
            
            # Prepare features (numeric columns only)
            X = self.df[self.numeric_cols].drop(columns=[target_column], errors='ignore')
            y = self.df[target_column].dropna()
            X = X.loc[y.index]
            
            if X.empty or len(X) == 0:
                return {"error": "No valid features for model training"}
            
            # Handle missing values
            X = X.fillna(X.mean())
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Train model
            if model_type == "regression":
                model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)
                
                mse = mean_squared_error(y_test, y_pred)
                rmse = np.sqrt(mse)
                
                metrics = {
                    "mse": float(mse),
                    "rmse": float(rmse),
                    "r2_score": float(model.score(X_test, y_test))
                }
            else:  # classification
                model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)
                
                metrics = {
                    "accuracy": float(accuracy_score(y_test, y_pred)),
                    "precision": float(precision_score(y_test, y_pred, average='weighted', zero_division=0)),
                    "recall": float(recall_score(y_test, y_pred, average='weighted', zero_division=0))
                }
            
            # Feature importance
            feature_importance = dict(zip(X.columns, model.feature_importances_))
            feature_importance = {k: float(v) for k, v in sorted(
                feature_importance.items(), key=lambda x: x[1], reverse=True
            )}
            
            return {
                "model_type": "RandomForest" + ("Regressor" if model_type == "regression" else "Classifier"),
                "target_column": target_column,
                "metrics": metrics,
                "feature_importance": feature_importance,
                "training_samples": len(X_train),
                "test_samples": len(X_test)
            }
        except Exception as e:
            logger.error(f"Error in predictive_modeling: {str(e)}")
            return {"error": str(e)}
    
    def outlier_detection(self, method: str = "iqr") -> Dict[str, Any]:
        """Detect outliers using IQR or Z-score method"""
        try:
            outliers = {}
            
            for column in self.numeric_cols:
                data = self.df[column].dropna()
                
                if method == "iqr":
                    Q1 = data.quantile(0.25)
                    Q3 = data.quantile(0.75)
                    IQR = Q3 - Q1
                    outlier_indices = ((data < (Q1 - 1.5 * IQR)) | (data > (Q3 + 1.5 * IQR))).sum()
                else:  # z-score
                    z_scores = np.abs(stats.zscore(data))
                    outlier_indices = (z_scores > 3).sum()
                
                if outlier_indices > 0:
                    outliers[column] = {
                        "outlier_count": int(outlier_indices),
                        "outlier_percent": float((outlier_indices / len(data)) * 100)
                    }
            
            return outliers if outliers else {"message": "No outliers detected"}
        except Exception as e:
            logger.error(f"Error in outlier_detection: {str(e)}")
            return {"error": str(e)}
    
    def complete_analysis(self, include_prediction: bool = True) -> Dict[str, Any]:
        """Run complete analysis suite"""
        try:
            analysis_results = {
                "timestamp": self.analysis_timestamp.isoformat(),
                "basic_statistics": self.basic_statistics(),
                "correlation": self.correlation_analysis(),
                "distribution": self.distribution_analysis(),
                "missing_values": self.missing_value_analysis(),
                "outliers": self.outlier_detection()
            }
            
            if include_prediction and len(self.numeric_cols) >= 2:
                analysis_results["predictive_model"] = self.predictive_modeling()
            
            return analysis_results
        except Exception as e:
            logger.error(f"Error in complete_analysis: {str(e)}")
            return {"error": str(e)}
