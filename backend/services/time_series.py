"""
Time Series Forecasting Module
Advanced time series analysis and forecasting
"""
import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
import logging
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor

logger = logging.getLogger(__name__)


class TimeSeriesAnalyzer:
    """Analyze time series data"""
    
    def __init__(self, df: pd.DataFrame, date_column: str, value_column: str):
        self.df = df.copy()
        self.date_column = date_column
        self.value_column = value_column
        
        # Convert to datetime if needed
        if not pd.api.types.is_datetime64_any_dtype(self.df[date_column]):
            self.df[date_column] = pd.to_datetime(self.df[date_column])
        
        # Sort by date
        self.df = self.df.sort_values(date_column)
        self.ts_data = self.df.set_index(date_column)[value_column]
    
    def detect_seasonality(self, period: Optional[int] = None) -> Dict[str, Any]:
        """Detect seasonality patterns"""
        try:
            if period is None:
                # Auto-detect period
                period = self._auto_detect_period()
            
            if len(self.ts_data) < period * 2:
                return {"message": "Insufficient data for seasonality detection"}
            
            # Calculate seasonal indices
            seasonal_indices = {}
            for i in range(period):
                indices = np.arange(i, len(self.ts_data), period)
                if len(indices) > 0:
                    seasonal_indices[i] = float(np.mean(self.ts_data.iloc[indices]))
            
            # Calculate seasonal strength
            seasonal_strength = self._calculate_seasonal_strength(period)
            
            return {
                "detected_period": period,
                "seasonal_indices": seasonal_indices,
                "seasonal_strength": float(seasonal_strength),
                "has_seasonality": seasonal_strength > 0.3,
                "seasonal_type": self._determine_seasonality_type(seasonal_indices)
            }
        except Exception as e:
            logger.error(f"Seasonality detection error: {str(e)}")
            return {"error": str(e)}
    
    def detect_trends(self) -> Dict[str, Any]:
        """Detect trends in time series"""
        try:
            # Fit linear regression
            X = np.arange(len(self.ts_data)).reshape(-1, 1)
            y = self.ts_data.values
            
            model = LinearRegression()
            model.fit(X, y)
            
            slope = float(model.coef_[0])
            intercept = float(model.intercept_)
            r_squared = float(model.score(X, y))
            
            # Determine trend direction
            if slope > 0:
                trend_direction = "UPWARD"
            elif slope < 0:
                trend_direction = "DOWNWARD"
            else:
                trend_direction = "FLAT"
            
            return {
                "slope": slope,
                "intercept": intercept,
                "r_squared": r_squared,
                "trend_direction": trend_direction,
                "trend_strength": abs(slope),
                "trend_line": [float(model.predict([[i]])[0]) for i in range(len(self.ts_data))]
            }
        except Exception as e:
            logger.error(f"Trend detection error: {str(e)}")
            return {"error": str(e)}
    
    def detect_anomalies(self, sensitivity: float = 2.5) -> Dict[str, Any]:
        """Detect anomalies in time series"""
        try:
            # Calculate rolling statistics
            window = min(7, len(self.ts_data) // 2)
            if window < 2:
                return {"message": "Insufficient data for anomaly detection"}
            
            rolling_mean = self.ts_data.rolling(window=window).mean()
            rolling_std = self.ts_data.rolling(window=window).std()
            
            # Calculate z-scores
            z_scores = np.abs((self.ts_data - rolling_mean) / rolling_std)
            
            # Identify anomalies
            anomalies = z_scores[z_scores > sensitivity]
            
            anomaly_details = []
            for date, value in anomalies.items():
                anomaly_details.append({
                    "date": date.isoformat(),
                    "value": float(self.ts_data[date]),
                    "z_score": float(value)
                })
            
            return {
                "anomaly_count": len(anomalies),
                "anomaly_percentage": float((len(anomalies) / len(self.ts_data)) * 100),
                "anomalies": anomaly_details[:10],  # Top 10
                "sensitivity": sensitivity
            }
        except Exception as e:
            logger.error(f"Anomaly detection error: {str(e)}")
            return {"error": str(e)}
    
    def forecast(self, periods: int = 12, method: str = "linear") -> Dict[str, Any]:
        """Forecast future values"""
        try:
            if method == "linear":
                forecast_values, confidence = self._linear_forecast(periods)
            elif method == "exponential":
                forecast_values, confidence = self._exponential_forecast(periods)
            elif method == "seasonal":
                forecast_values, confidence = self._seasonal_forecast(periods)
            else:
                return {"error": f"Unknown method: {method}"}
            
            # Create forecast dataframe
            last_date = self.ts_data.index[-1]
            forecast_dates = [last_date + timedelta(days=i+1) for i in range(periods)]
            
            forecast_df = pd.DataFrame({
                "date": forecast_dates,
                "forecast": forecast_values,
                "lower_ci": confidence['lower'],
                "upper_ci": confidence['upper']
            })
            
            return {
                "method": method,
                "periods": periods,
                "forecasts": forecast_df.to_dict(orient='records'),
                "forecast_stats": {
                    "mean_forecast": float(np.mean(forecast_values)),
                    "std_forecast": float(np.std(forecast_values)),
                    "min_forecast": float(np.min(forecast_values)),
                    "max_forecast": float(np.max(forecast_values))
                }
            }
        except Exception as e:
            logger.error(f"Forecast error: {str(e)}")
            return {"error": str(e)}
    
    def _linear_forecast(self, periods: int) -> Tuple[List[float], Dict[str, List[float]]]:
        """Linear regression forecast"""
        X = np.arange(len(self.ts_data)).reshape(-1, 1)
        y = self.ts_data.values
        
        model = LinearRegression()
        model.fit(X, y)
        
        # Forecast
        X_future = np.arange(len(self.ts_data), len(self.ts_data) + periods).reshape(-1, 1)
        predictions = model.predict(X_future)
        
        # Calculate confidence intervals
        residuals = y - model.predict(X)
        residual_std = np.std(residuals)
        
        lower_ci = predictions - 1.96 * residual_std
        upper_ci = predictions + 1.96 * residual_std
        
        return list(predictions), {"lower": list(lower_ci), "upper": list(upper_ci)}
    
    def _exponential_forecast(self, periods: int) -> Tuple[List[float], Dict[str, List[float]]]:
        """Exponential smoothing forecast"""
        from scipy.optimize import minimize
        
        def smooth(alpha):
            result = [self.ts_data.iloc[0]]
            for i in range(1, len(self.ts_data)):
                result.append(alpha * self.ts_data.iloc[i] + (1 - alpha) * result[i - 1])
            return np.array(result)
        
        # Find best alpha
        residuals_fn = lambda alpha: np.sum((self.ts_data - smooth(alpha)) ** 2)
        result = minimize(residuals_fn, 0.5, bounds=[(0, 1)])
        alpha = result.x[0]
        
        # Forecast
        smoothed = smooth(alpha)
        forecast_values = [smoothed[-1]] * periods
        
        residual_std = np.std(self.ts_data - smoothed)
        lower_ci = [f - 1.96 * residual_std for f in forecast_values]
        upper_ci = [f + 1.96 * residual_std for f in forecast_values]
        
        return forecast_values, {"lower": lower_ci, "upper": upper_ci}
    
    def _seasonal_forecast(self, periods: int) -> Tuple[List[float], Dict[str, List[float]]]:
        """Seasonal forecast"""
        seasonality = self.detect_seasonality()
        
        if "detected_period" not in seasonality:
            return self._linear_forecast(periods)
        
        period = seasonality["detected_period"]
        trend = self.detect_trends()
        
        # Use trend + seasonal components
        trend_values = trend.get("trend_line", [0] * len(self.ts_data))
        
        forecast_values = []
        for i in range(periods):
            seasonal_index = i % period
            trend_component = trend_values[-1] + trend["slope"] * (i + 1)
            seasonal_component = seasonality["seasonal_indices"].get(seasonal_index, 1.0)
            forecast_values.append(trend_component * seasonal_component)
        
        residual_std = np.std(self.ts_data - np.array(trend_values))
        lower_ci = [f - 1.96 * residual_std for f in forecast_values]
        upper_ci = [f + 1.96 * residual_std for f in forecast_values]
        
        return forecast_values, {"lower": lower_ci, "upper": upper_ci}
    
    def _auto_detect_period(self) -> int:
        """Auto-detect seasonal period"""
        if len(self.ts_data) < 24:
            return 12
        
        # Try common periods
        for period in [7, 12, 24, 30, 52]:
            if len(self.ts_data) >= period * 2:
                return period
        
        return 12
    
    def _calculate_seasonal_strength(self, period: int) -> float:
        """Calculate seasonal strength"""
        try:
            seasonal = np.zeros(len(self.ts_data))
            for i in range(period):
                indices = np.arange(i, len(self.ts_data), period)
                seasonal[indices] = np.mean(self.ts_data.iloc[indices])
            
            seasonal_var = np.var(seasonal)
            total_var = np.var(self.ts_data)
            
            return seasonal_var / total_var if total_var > 0 else 0
        except:
            return 0
    
    def _determine_seasonality_type(self, indices: Dict) -> str:
        """Determine if seasonality is additive or multiplicative"""
        values = list(indices.values())
        cv = np.std(values) / np.mean(values) if np.mean(values) != 0 else 0
        return "MULTIPLICATIVE" if cv > 0.1 else "ADDITIVE"
    
    def get_comprehensive_analysis(self) -> Dict[str, Any]:
        """Get comprehensive time series analysis"""
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "data_points": len(self.ts_data),
            "date_range": {
                "start": self.ts_data.index[0].isoformat(),
                "end": self.ts_data.index[-1].isoformat()
            },
            "trends": self.detect_trends(),
            "seasonality": self.detect_seasonality(),
            "anomalies": self.detect_anomalies(),
            "forecast_12_periods": self.forecast(periods=12, method="seasonal")
        }
