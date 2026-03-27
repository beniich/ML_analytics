"""
Anomaly Detection Module
Detects anomalies in data and triggers automatic alerts
"""
import numpy as np
import pandas as pd
from scipy import stats
from typing import Dict, List, Tuple, Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import logging
import asyncio

logger = logging.getLogger(__name__)


class AnomalyDetector:
    """Advanced anomaly detection with multiple methods"""
    
    def __init__(self, sensitivity_threshold: float = 2.5):
        self.sensitivity_threshold = sensitivity_threshold
        self.alert_config = {
            'email_enabled': False,
            'slack_enabled': False,
            'webhook_enabled': False,
            'email_recipients': [],
            'slack_webhook_url': '',
            'webhook_url': '',
            'smtp_server': 'smtp.gmail.com',
            'smtp_port': 587,
            'smtp_user': '',
            'smtp_password': ''
        }
        self.anomaly_history = []
    
    def detect_outliers_zscore(self, series: pd.Series) -> Dict:
        """Detect outliers using Z-score method"""
        try:
            clean_series = series.dropna()
            if len(clean_series) == 0:
                return {"error": "Empty series"}
            
            z_scores = np.abs(stats.zscore(clean_series))
            outlier_mask = z_scores > self.sensitivity_threshold
            outlier_count = outlier_mask.sum()
            
            return {
                "method": "Z-Score",
                "outlier_count": int(outlier_count),
                "threshold": float(self.sensitivity_threshold),
                "percentage": float((outlier_count / len(clean_series)) * 100),
                "max_z_score": float(z_scores.max())
            }
        except Exception as e:
            logger.error(f"Error in Z-score detection: {str(e)}")
            return {"error": str(e)}
    
    def detect_outliers_iqr(self, series: pd.Series) -> Dict:
        """Detect outliers using Interquartile Range method"""
        try:
            Q1 = series.quantile(0.25)
            Q3 = series.quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            outlier_mask = (series < lower_bound) | (series > upper_bound)
            outlier_count = outlier_mask.sum()
            
            return {
                "method": "IQR",
                "outlier_count": int(outlier_count),
                "lower_bound": float(lower_bound),
                "upper_bound": float(upper_bound),
                "percentage": float((outlier_count / len(series)) * 100)
            }
        except Exception as e:
            logger.error(f"Error in IQR detection: {str(e)}")
            return {"error": str(e)}
    
    def generate_alert_report(self, anomalies: Dict, context: str = "") -> Dict:
        """Generate a formatted alert report"""
        report = {
            "timestamp": datetime.utcnow().isoformat(),
            "context": context,
            "anomalies_detected": bool(anomalies),
            "anomaly_count": len(anomalies),
            "details": anomalies
        }
        self.anomaly_history.append(report)
        return report

anomaly_detector = AnomalyDetector()
