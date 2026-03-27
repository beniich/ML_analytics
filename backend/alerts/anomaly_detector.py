import numpy as np
import pandas as pd
from scipy import stats
from typing import Dict, List, Tuple
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class AnomalyDetector:
    def __init__(self, sensitivity_threshold: float = 2.5):
        self.sensitivity_threshold = sensitivity_threshold
        self.alert_config = {
            'email_enabled': False,
            'email_recipients': [],
            'smtp_server': '',
            'smtp_port': 587,
            'smtp_user': '',
            'smtp_password': ''
        }
    
    def detect_outliers_iqr(self, series: pd.Series) -> List[int]:
        """Détection d'anomalies par méthode IQR"""
        Q1 = series.quantile(0.25)
        Q3 = series.quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        return series[(series < lower_bound) | (series > upper_bound)].index.tolist()
    
    def detect_outliers_zscore(self, series: pd.Series) -> List[int]:
        """Détection d'anomalies par Z-score"""
        z_scores = np.abs(stats.zscore(series.dropna()))
        return series.dropna().iloc[z_scores > self.sensitivity_threshold].index.tolist()
    
    def detect_distribution_shift(self, current_data: pd.DataFrame, historical_data: pd.DataFrame) -> Dict:
        """Détection de changement de distribution"""
        shifts = {}
        for column in current_data.select_dtypes(include=[np.number]).columns:
            if column in historical_data.columns:
                # Test de Kolmogorov-Smirnov
                try:
                    statistic, p_value = stats.ks_2samp(
                        historical_data[column].dropna(), 
                        current_data[column].dropna()
                    )
                    if p_value < 0.05:  # Significatif
                        shifts[column] = {
                            'p_value': p_value,
                            'statistic': statistic,
                            'message': f'Distribution shift detected in {column}'
                        }
                except Exception as e:
                    shifts[column] = {'error': str(e)}
        return shifts
    
    def detect_missing_data_spike(self, current_missing: Dict, historical_avg: Dict, threshold: float = 2.0) -> List[str]:
        """Détection de pic anormal de données manquantes"""
        spikes = []
        for column, current_count in current_missing.items():
            avg_count = historical_avg.get(column, 0)
            if avg_count > 0:
                ratio = current_count / avg_count
                if ratio > threshold:
                    spikes.append(column)
        return spikes
    
    def generate_alert_report(self, anomalies: Dict, context: str = "") -> Dict:
        """Génère un rapport d'alerte formaté"""
        alert_report = {
            'timestamp': pd.Timestamp.now().isoformat(),
            'context': context,
            'anomalies_detected': len(anomalies),
            'details': anomalies
        }
        return alert_report
    
    def send_email_alert(self, subject: str, body: str):
        """Envoi d'alerte par email"""
        if not self.alert_config['email_enabled']:
            return
        
        msg = MIMEMultipart()
        msg['From'] = self.alert_config['smtp_user']
        msg['To'] = ', '.join(self.alert_config['email_recipients'])
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'plain'))
        
        try:
            server = smtplib.SMTP(self.alert_config['smtp_server'], self.alert_config['smtp_port'])
            server.starttls()
            server.login(self.alert_config['smtp_user'], self.alert_config['smtp_password'])
            text = msg.as_string()
            server.sendmail(self.alert_config['smtp_user'], self.alert_config['email_recipients'], text)
            server.quit()
        except Exception as e:
            print(f"Failed to send email alert: {e}")

# Instance globale du détecteur
anomaly_detector = AnomalyDetector()

def configure_alerts(email_config: Dict):
    """Configuration des alertes"""
    anomaly_detector.alert_config.update(email_config)
