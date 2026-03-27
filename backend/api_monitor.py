"""
API Monitoring and Analytics Module
Track API performance and usage metrics
"""
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import logging
from enum import Enum
from sqlalchemy import Column, Integer, String, DateTime, Float, JSON as SQLJSON
from sqlalchemy.ext.declarative import declarative_base

logger = logging.getLogger(__name__)

Base = declarative_base()


class APIMetric(Base):
    """Database model for API metrics"""
    __tablename__ = "api_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    endpoint = Column(String(200), index=True)
    method = Column(String(10))  # GET, POST, etc.
    user_id = Column(Integer, index=True)
    status_code = Column(Integer)
    response_time_ms = Column(Float)
    request_size_bytes = Column(Integer)
    response_size_bytes = Column(Integer)
    timestamp = Column(DateTime(timezone=True), index=True, default=datetime.utcnow)
    error_message = Column(String(500))
    
    # Metadata
    query_params = Column(SQLJSON)
    headers = Column(SQLJSON)


class APIHealthStatus(str, Enum):
    """API health status"""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    DOWN = "down"


class APIMonitor:
    """Monitor API performance and health"""
    
    def __init__(self, history_limit: int = 10000):
        self.metrics: List[Dict[str, Any]] = []
        self.history_limit = history_limit
        self.alerts: List[Dict[str, Any]] = []
        self.thresholds = {
            "response_time_ms": 1000,  # Warn if > 1s
            "error_rate_pct": 5.0,  # Warn if > 5% errors
            "availability_pct": 99.0  # Warn if < 99%
        }
    
    def record_request(
        self,
        endpoint: str,
        method: str,
        user_id: int,
        status_code: int,
        response_time_ms: float,
        request_size_bytes: int = 0,
        response_size_bytes: int = 0,
        error_message: Optional[str] = None
    ) -> None:
        """Record API request metric"""
        metric = {
            "endpoint": endpoint,
            "method": method,
            "user_id": user_id,
            "status_code": status_code,
            "response_time_ms": response_time_ms,
            "request_size_bytes": request_size_bytes,
            "response_size_bytes": response_size_bytes,
            "timestamp": datetime.utcnow().isoformat(),
            "error_message": error_message,
            "is_error": status_code >= 400
        }
        
        self.metrics.append(metric)
        
        # Keep history limit
        if len(self.metrics) > self.history_limit:
            self.metrics = self.metrics[-self.history_limit:]
        
        # Check for alerts
        self._check_thresholds(metric)
        
        logger.debug(f"Recorded metric: {endpoint} {method} {status_code} {response_time_ms}ms")
    
    def _check_thresholds(self, metric: Dict[str, Any]) -> None:
        """Check if metric exceeds thresholds"""
        # Check response time
        if metric["response_time_ms"] > self.thresholds["response_time_ms"]:
            self._create_alert(
                "SLOW_REQUEST",
                f"Slow request detected: {metric['endpoint']} took {metric['response_time_ms']}ms",
                "WARNING"
            )
        
        # Check error
        if metric["is_error"]:
            self._create_alert(
                "ERROR",
                f"Error on {metric['endpoint']}: {metric['status_code']}",
                "ERROR"
            )
    
    def _create_alert(self, alert_type: str, message: str, severity: str) -> None:
        """Create an alert"""
        alert = {
            "type": alert_type,
            "message": message,
            "severity": severity,
            "timestamp": datetime.utcnow().isoformat()
        }
        self.alerts.append(alert)
        
        # Keep recent alerts only
        if len(self.alerts) > 100:
            self.alerts = self.alerts[-100:]
        
        logger.warning(f"Alert created: {alert_type} - {message}")
    
    def get_endpoint_stats(
        self,
        endpoint: Optional[str] = None,
        time_window_minutes: int = 60
    ) -> Dict[str, Any]:
        """Get statistics for endpoint(s)"""
        cutoff_time = datetime.utcnow() - timedelta(minutes=time_window_minutes)
        
        # Filter metrics
        if endpoint:
            filtered = [m for m in self.metrics if m["endpoint"] == endpoint]
        else:
            filtered = self.metrics
        
        # Further filter by time
        filtered = [
            m for m in filtered
            if datetime.fromisoformat(m["timestamp"]) >= cutoff_time
        ]
        
        if not filtered:
            return {"message": "No data available"}
        
        # Calculate statistics
        stats = {
            "endpoint": endpoint or "ALL",
            "time_window_minutes": time_window_minutes,
            "total_requests": len(filtered),
            "response_time_ms": {
                "min": min(m["response_time_ms"] for m in filtered),
                "max": max(m["response_time_ms"] for m in filtered),
                "mean": sum(m["response_time_ms"] for m in filtered) / len(filtered),
                "median": sorted([m["response_time_ms"] for m in filtered])[len(filtered) // 2]
            },
            "status_codes": {},
            "error_count": sum(1 for m in filtered if m["is_error"]),
            "error_rate_pct": (sum(1 for m in filtered if m["is_error"]) / len(filtered) * 100)
        }
        
        # Count status codes
        for metric in filtered:
            code = metric["status_code"]
            stats["status_codes"][code] = stats["status_codes"].get(code, 0) + 1
        
        # Total data transferred
        stats["total_request_bytes"] = sum(m["request_size_bytes"] for m in filtered)
        stats["total_response_bytes"] = sum(m["response_size_bytes"] for m in filtered)
        
        return stats
    
    def get_user_stats(self, user_id: int, time_window_minutes: int = 60) -> Dict[str, Any]:
        """Get statistics for a user"""
        cutoff_time = datetime.utcnow() - timedelta(minutes=time_window_minutes)
        
        filtered = [
            m for m in self.metrics
            if m["user_id"] == user_id and
            datetime.fromisoformat(m["timestamp"]) >= cutoff_time
        ]
        
        if not filtered:
            return {"message": "No data available"}
        
        return {
            "user_id": user_id,
            "time_window_minutes": time_window_minutes,
            "total_requests": len(filtered),
            "endpoints_used": len(set(m["endpoint"] for m in filtered)),
            "error_count": sum(1 for m in filtered if m["is_error"]),
            "avg_response_time_ms": sum(m["response_time_ms"] for m in filtered) / len(filtered),
            "total_data_transferred_bytes": sum(
                m["request_size_bytes"] + m["response_size_bytes"] for m in filtered
            )
        }
    
    def get_api_health(self) -> Dict[str, Any]:
        """Get overall API health status"""
        if not self.metrics:
            return {"status": APIHealthStatus.HEALTHY.value}
        
        # Last 100 requests
        recent = self.metrics[-100:]
        
        error_rate = (sum(1 for m in recent if m["is_error"]) / len(recent) * 100)
        avg_response_time = sum(m["response_time_ms"] for m in recent) / len(recent)
        
        # Determine health
        if error_rate > self.thresholds["error_rate_pct"] or avg_response_time > self.thresholds["response_time_ms"] * 2:
            status = APIHealthStatus.DEGRADED.value
        elif error_rate > self.thresholds["error_rate_pct"] * 2:
            status = APIHealthStatus.DOWN.value
        else:
            status = APIHealthStatus.HEALTHY.value
        
        return {
            "status": status,
            "error_rate_pct": round(error_rate, 2),
            "avg_response_time_ms": round(avg_response_time, 2),
            "recent_requests": len(recent),
            "uptime_pct": round((1 - error_rate / 100) * 100, 2),
            "recent_errors": [m for m in recent if m["is_error"]][:5]
        }
    
    def get_top_endpoints(self, limit: int = 10, time_window_minutes: int = 60) -> List[Dict[str, Any]]:
        """Get top endpoints by request count"""
        cutoff_time = datetime.utcnow() - timedelta(minutes=time_window_minutes)
        
        filtered = [
            m for m in self.metrics
            if datetime.fromisoformat(m["timestamp"]) >= cutoff_time
        ]
        
        endpoint_stats = {}
        for metric in filtered:
            endpoint = metric["endpoint"]
            if endpoint not in endpoint_stats:
                endpoint_stats[endpoint] = {
                    "endpoint": endpoint,
                    "count": 0,
                    "errors": 0,
                    "total_time_ms": 0
                }
            
            endpoint_stats[endpoint]["count"] += 1
            if metric["is_error"]:
                endpoint_stats[endpoint]["errors"] += 1
            endpoint_stats[endpoint]["total_time_ms"] += metric["response_time_ms"]
        
        # Calculate averages and sort
        for stats in endpoint_stats.values():
            stats["avg_response_time_ms"] = stats["total_time_ms"] / stats["count"]
            stats["error_rate_pct"] = (stats["errors"] / stats["count"] * 100) if stats["count"] > 0 else 0
        
        sorted_endpoints = sorted(
            endpoint_stats.values(),
            key=lambda x: x["count"],
            reverse=True
        )
        
        return sorted_endpoints[:limit]
    
    def get_performance_report(self) -> Dict[str, Any]:
        """Generate comprehensive performance report"""
        if not self.metrics:
            return {"message": "No metrics available"}
        
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "api_health": self.get_api_health(),
            "top_endpoints": self.get_top_endpoints(limit=5),
            "recent_alerts": self.alerts[-10:],
            "total_requests_recorded": len(self.metrics),
            "unique_users": len(set(m["user_id"] for m in self.metrics)),
            "unique_endpoints": len(set(m["endpoint"] for m in self.metrics)),
            "total_errors": sum(1 for m in self.metrics if m["is_error"]),
            "time_period": {
                "start": self.metrics[0]["timestamp"] if self.metrics else None,
                "end": self.metrics[-1]["timestamp"] if self.metrics else None
            }
        }
    
    def set_thresholds(self, **kwargs) -> None:
        """Update alert thresholds"""
        for key, value in kwargs.items():
            if key in self.thresholds:
                self.thresholds[key] = value
                logger.info(f"Threshold updated: {key} = {value}")
    
    def clear_old_metrics(self, hours: int = 24) -> int:
        """Clear metrics older than specified hours"""
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        
        initial_count = len(self.metrics)
        self.metrics = [
            m for m in self.metrics
            if datetime.fromisoformat(m["timestamp"]) >= cutoff_time
        ]
        
        removed = initial_count - len(self.metrics)
        logger.info(f"Cleared {removed} old metrics")
        
        return removed


# Global monitor instance
api_monitor = APIMonitor()
