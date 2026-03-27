"""
Data Quality Module
Comprehensive data quality checks and validation
"""
import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class DataQualityValidator:
    """Comprehensive data quality validation"""
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.quality_score = 0
        self.validation_results = {}
    
    def check_completeness(self) -> Dict[str, Any]:
        """Check data completeness (missing values)"""
        try:
            missing_data = {}
            total_cells = len(self.df) * len(self.df.columns)
            missing_cells = self.df.isnull().sum().sum()
            completeness_pct = ((total_cells - missing_cells) / total_cells) * 100
            
            for col in self.df.columns:
                missing_count = self.df[col].isnull().sum()
                missing_pct = (missing_count / len(self.df)) * 100
                
                missing_data[col] = {
                    "missing_count": int(missing_count),
                    "missing_percentage": float(missing_pct),
                    "status": "GOOD" if missing_pct < 5 else "WARNING" if missing_pct < 20 else "CRITICAL"
                }
            
            return {
                "overall_completeness": float(completeness_pct),
                "total_missing_cells": int(missing_cells),
                "column_completeness": missing_data,
                "status": "GOOD" if completeness_pct > 95 else "WARNING" if completeness_pct > 80 else "CRITICAL"
            }
        except Exception as e:
            logger.error(f"Completeness check error: {str(e)}")
            return {"error": str(e)}
    
    def check_consistency(self) -> Dict[str, Any]:
        """Check data consistency"""
        try:
            consistency_issues = {}
            
            # Check for duplicates
            duplicate_rows = self.df.duplicated().sum()
            
            # Check data type consistency
            for col in self.df.columns:
                col_type = self.df[col].dtype
                if col_type == 'object':
                    unique_types = len(set(type(x).__name__ for x in self.df[col].dropna()))
                    if unique_types > 1:
                        consistency_issues[col] = f"Mixed types: {unique_types} types found"
            
            return {
                "duplicate_rows": int(duplicate_rows),
                "duplicate_percentage": float((duplicate_rows / len(self.df)) * 100) if len(self.df) > 0 else 0,
                "consistency_issues": consistency_issues,
                "status": "GOOD" if not consistency_issues and duplicate_rows == 0 else "WARNING"
            }
        except Exception as e:
            logger.error(f"Consistency check error: {str(e)}")
            return {"error": str(e)}
    
    def check_validity(self) -> Dict[str, Any]:
        """Check data validity (type matching, range checks)"""
        try:
            validity_issues = {}
            
            for col in self.df.columns:
                col_dtype = self.df[col].dtype
                
                if col_dtype == 'object':
                    # Check for empty strings
                    empty_strings = (self.df[col] == '').sum()
                    if empty_strings > 0:
                        validity_issues[col] = f"Contains {empty_strings} empty strings"
                
                elif col_dtype in ['int64', 'float64']:
                    # Check for negative values where unexpected
                    if col.lower() in ['age', 'count', 'quantity', 'amount', 'price']:
                        negative_count = (self.df[col] < 0).sum()
                        if negative_count > 0:
                            validity_issues[col] = f"Contains {negative_count} negative values"
                    
                    # Check for outliers using IQR
                    Q1 = self.df[col].quantile(0.25)
                    Q3 = self.df[col].quantile(0.75)
                    IQR = Q3 - Q1
                    outlier_count = ((self.df[col] < (Q1 - 3 * IQR)) | 
                                    (self.df[col] > (Q3 + 3 * IQR))).sum()
                    if outlier_count > 0:
                        validity_issues[f"{col}_outliers"] = f"Contains {outlier_count} extreme outliers"
            
            return {
                "validity_issues": validity_issues,
                "status": "GOOD" if not validity_issues else "WARNING",
                "issue_count": len(validity_issues)
            }
        except Exception as e:
            logger.error(f"Validity check error: {str(e)}")
            return {"error": str(e)}
    
    def check_accuracy(self) -> Dict[str, Any]:
        """Check data accuracy (statistical properties)"""
        try:
            accuracy_metrics = {}
            
            numeric_cols = self.df.select_dtypes(include=['number']).columns
            
            for col in numeric_cols:
                data = self.df[col].dropna()
                if len(data) > 0:
                    # Calculate statistical properties
                    mean = data.mean()
                    std = data.std()
                    
                    # Flag if distribution seems off
                    skewness = data.skew()
                    kurtosis = data.kurtosis()
                    
                    accuracy_metrics[col] = {
                        "mean": float(mean),
                        "std": float(std),
                        "skewness": float(skewness),
                        "kurtosis": float(kurtosis),
                        "distribution_shape": "NORMAL" if abs(skewness) < 0.5 else "SKEWED"
                    }
            
            return {
                "accuracy_metrics": accuracy_metrics,
                "status": "GOOD"
            }
        except Exception as e:
            logger.error(f"Accuracy check error: {str(e)}")
            return {"error": str(e)}
    
    def check_uniqueness(self) -> Dict[str, Any]:
        """Check column uniqueness"""
        try:
            uniqueness_metrics = {}
            
            for col in self.df.columns:
                unique_count = self.df[col].nunique()
                unique_ratio = (unique_count / len(self.df)) * 100
                
                uniqueness_metrics[col] = {
                    "unique_count": int(unique_count),
                    "unique_ratio": float(unique_ratio),
                    "status": "HIGH" if unique_ratio > 90 else "MEDIUM" if unique_ratio > 50 else "LOW"
                }
            
            return uniqueness_metrics
        except Exception as e:
            logger.error(f"Uniqueness check error: {str(e)}")
            return {"error": str(e)}
    
    def check_freshness(self, date_column: Optional[str] = None) -> Dict[str, Any]:
        """Check data freshness (age of data)"""
        try:
            if date_column and date_column in self.df.columns:
                try:
                    dates = pd.to_datetime(self.df[date_column])
                    max_date = dates.max()
                    age_days = (datetime.now() - max_date).days
                    
                    return {
                        "latest_date": max_date.isoformat(),
                        "data_age_days": int(age_days),
                        "status": "FRESH" if age_days <= 7 else "STALE" if age_days <= 30 else "VERY_STALE"
                    }
                except:
                    return {"error": "Could not parse date column"}
            else:
                return {"message": "No date column specified"}
        except Exception as e:
            logger.error(f"Freshness check error: {str(e)}")
            return {"error": str(e)}
    
    def generate_quality_report(self, date_column: Optional[str] = None) -> Dict[str, Any]:
        """Generate comprehensive data quality report"""
        try:
            report = {
                "timestamp": datetime.utcnow().isoformat(),
                "dataset_info": {
                    "rows": len(self.df),
                    "columns": len(self.df.columns),
                    "memory_mb": float(self.df.memory_usage(deep=True).sum() / 1024**2)
                },
                "completeness": self.check_completeness(),
                "consistency": self.check_consistency(),
                "validity": self.check_validity(),
                "accuracy": self.check_accuracy(),
                "uniqueness": self.check_uniqueness(),
                "freshness": self.check_freshness(date_column)
            }
            
            # Calculate overall quality score (0-100)
            scores = []
            if "status" in report["completeness"]:
                status_map = {"GOOD": 95, "WARNING": 70, "CRITICAL": 30}
                scores.append(status_map.get(report["completeness"]["status"], 50))
            
            if "status" in report["consistency"]:
                status_map = {"GOOD": 95, "WARNING": 70}
                scores.append(status_map.get(report["consistency"]["status"], 50))
            
            if "status" in report["validity"]:
                status_map = {"GOOD": 95, "WARNING": 70}
                scores.append(status_map.get(report["validity"]["status"], 50))
            
            report["overall_quality_score"] = float(np.mean(scores)) if scores else 0
            report["quality_status"] = self._get_quality_status(report["overall_quality_score"])
            
            return report
        except Exception as e:
            logger.error(f"Quality report error: {str(e)}")
            return {"error": str(e)}
    
    @staticmethod
    def _get_quality_status(score: float) -> str:
        """Determine quality status from score"""
        if score >= 90:
            return "EXCELLENT"
        elif score >= 75:
            return "GOOD"
        elif score >= 60:
            return "FAIR"
        else:
            return "POOR"


class DataProfiler:
    """Generate detailed data profiles"""
    
    @staticmethod
    def profile(df: pd.DataFrame) -> Dict[str, Any]:
        """Generate comprehensive data profile"""
        try:
            profile = {
                "dataset_shape": {"rows": len(df), "columns": len(df.columns)},
                "column_profiles": {}
            }
            
            for col in df.columns:
                col_profile = {
                    "dtype": str(df[col].dtype),
                    "missing_count": int(df[col].isnull().sum()),
                    "unique_values": int(df[col].nunique()),
                    "missing_pct": float((df[col].isnull().sum() / len(df)) * 100)
                }
                
                if df[col].dtype in ['int64', 'float64']:
                    col_profile.update({
                        "min": float(df[col].min()),
                        "max": float(df[col].max()),
                        "mean": float(df[col].mean()),
                        "median": float(df[col].median()),
                        "std": float(df[col].std())
                    })
                else:
                    col_profile["top_values"] = df[col].value_counts().head(3).to_dict()
                
                profile["column_profiles"][col] = col_profile
            
            return profile
        except Exception as e:
            logger.error(f"Profiling error: {str(e)}")
            return {"error": str(e)}
