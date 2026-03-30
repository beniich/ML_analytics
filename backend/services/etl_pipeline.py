"""
ETL (Extract, Transform, Load) Module
Data transformation and pipeline management
"""
import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional, Callable
from datetime import datetime
import logging
from enum import Enum

logger = logging.getLogger(__name__)


class TransformationType(str, Enum):
    """Types of data transformations"""
    FILTER = "filter"
    AGGREGATE = "aggregate"
    JOIN = "join"
    PIVOT = "pivot"
    MELT = "melt"
    FILL_MISSING = "fill_missing"
    NORMALIZE = "normalize"
    SCALE = "scale"
    ENCODE = "encode"
    EXTRACT = "extract"
    REPLACE = "replace"
    RENAME = "rename"
    TYPE_CONVERT = "type_convert"


class ETLTransformer:
    """Handles data transformation operations"""
    
    def __init__(self, df: pd.DataFrame):
        self.df = df.copy()
        self.original_df = df.copy()
        self.transformation_log = []
    
    def filter_rows(
        self,
        column: str,
        operator: str,
        value: Any,
        name: Optional[str] = None
    ) -> 'ETLTransformer':
        """Filter rows based on condition"""
        try:
            original_count = len(self.df)
            
            if operator == "eq":
                self.df = self.df[self.df[column] == value]
            elif operator == "ne":
                self.df = self.df[self.df[column] != value]
            elif operator == "gt":
                self.df = self.df[self.df[column] > value]
            elif operator == "lt":
                self.df = self.df[self.df[column] < value]
            elif operator == "gte":
                self.df = self.df[self.df[column] >= value]
            elif operator == "lte":
                self.df = self.df[self.df[column] <= value]
            elif operator == "in":
                self.df = self.df[self.df[column].isin(value)]
            elif operator == "not_in":
                self.df = self.df[~self.df[column].isin(value)]
            elif operator == "contains":
                self.df = self.df[self.df[column].astype(str).str.contains(value)]
            else:
                raise ValueError(f"Unknown operator: {operator}")
            
            new_count = len(self.df)
            self.transformation_log.append({
                "type": TransformationType.FILTER.value,
                "description": name or f"Filter {column} {operator} {value}",
                "rows_affected": original_count - new_count,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            logger.info(f"Filtered {original_count - new_count} rows")
            return self
        except Exception as e:
            logger.error(f"Filter error: {str(e)}")
            raise
    
    def aggregate(
        self,
        groupby_columns: List[str],
        aggregations: Dict[str, str],
        name: Optional[str] = None
    ) -> 'ETLTransformer':
        """Aggregate data"""
        try:
            agg_dict = {}
            for col, operation in aggregations.items():
                if operation in ['sum', 'mean', 'median', 'min', 'max', 'count', 'std']:
                    agg_dict[col] = operation
            
            self.df = self.df.groupby(groupby_columns).agg(agg_dict).reset_index()
            
            self.transformation_log.append({
                "type": TransformationType.AGGREGATE.value,
                "description": name or f"Aggregated by {groupby_columns}",
                "groupby_columns": groupby_columns,
                "aggregations": aggregations,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            logger.info(f"Data aggregated by {groupby_columns}")
            return self
        except Exception as e:
            logger.error(f"Aggregation error: {str(e)}")
            raise
    
    def fill_missing_values(
        self,
        method: str = "forward",
        value: Optional[Any] = None,
        columns: Optional[List[str]] = None,
        name: Optional[str] = None
    ) -> 'ETLTransformer':
        """Fill missing values"""
        try:
            original_missing = self.df.isnull().sum().sum()
            
            if columns:
                target_df = self.df[columns]
            else:
                target_df = self.df
            
            if method == "forward":
                target_df = target_df.fillna(method='ffill')
            elif method == "backward":
                target_df = target_df.fillna(method='bfill')
            elif method == "mean":
                for col in target_df.select_dtypes(include=['number']).columns:
                    target_df[col].fillna(target_df[col].mean(), inplace=True)
            elif method == "median":
                for col in target_df.select_dtypes(include=['number']).columns:
                    target_df[col].fillna(target_df[col].median(), inplace=True)
            elif method == "value":
                target_df = target_df.fillna(value)
            
            if columns:
                self.df[columns] = target_df
            else:
                self.df = target_df
            
            new_missing = self.df.isnull().sum().sum()
            
            self.transformation_log.append({
                "type": TransformationType.FILL_MISSING.value,
                "description": name or f"Filled missing values using {method}",
                "missing_filled": original_missing - new_missing,
                "method": method,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            logger.info(f"Filled {original_missing - new_missing} missing values")
            return self
        except Exception as e:
            logger.error(f"Fill missing values error: {str(e)}")
            raise
    
    def normalize_column(
        self,
        column: str,
        method: str = "minmax",
        name: Optional[str] = None
    ) -> 'ETLTransformer':
        """Normalize numeric column"""
        try:
            if method == "minmax":
                min_val = self.df[column].min()
                max_val = self.df[column].max()
                self.df[column] = (self.df[column] - min_val) / (max_val - min_val)
            elif method == "zscore":
                mean = self.df[column].mean()
                std = self.df[column].std()
                self.df[column] = (self.df[column] - mean) / std
            elif method == "log":
                self.df[column] = np.log1p(self.df[column])
            
            self.transformation_log.append({
                "type": TransformationType.NORMALIZE.value,
                "description": name or f"Normalized {column} using {method}",
                "column": column,
                "method": method,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            logger.info(f"Normalized column {column} using {method}")
            return self
        except Exception as e:
            logger.error(f"Normalization error: {str(e)}")
            raise
    
    def rename_columns(
        self,
        mapping: Dict[str, str],
        name: Optional[str] = None
    ) -> 'ETLTransformer':
        """Rename columns"""
        try:
            self.df = self.df.rename(columns=mapping)
            
            self.transformation_log.append({
                "type": TransformationType.RENAME.value,
                "description": name or "Renamed columns",
                "mapping": mapping,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            logger.info(f"Renamed {len(mapping)} columns")
            return self
        except Exception as e:
            logger.error(f"Rename error: {str(e)}")
            raise
    
    def drop_columns(self, columns: List[str], name: Optional[str] = None) -> 'ETLTransformer':
        """Drop columns"""
        try:
            existing_cols = [c for c in columns if c in self.df.columns]
            self.df = self.df.drop(columns=existing_cols)
            
            self.transformation_log.append({
                "type": "drop",
                "description": name or f"Dropped {len(existing_cols)} columns",
                "columns": existing_cols,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            logger.info(f"Dropped {len(existing_cols)} columns")
            return self
        except Exception as e:
            logger.error(f"Drop error: {str(e)}")
            raise
    
    def replace_values(
        self,
        column: str,
        mapping: Dict[Any, Any],
        name: Optional[str] = None
    ) -> 'ETLTransformer':
        """Replace values in a column"""
        try:
            self.df[column] = self.df[column].replace(mapping)
            
            self.transformation_log.append({
                "type": TransformationType.REPLACE.value,
                "description": name or f"Replaced values in {column}",
                "column": column,
                "replacements": len(mapping),
                "timestamp": datetime.utcnow().isoformat()
            })
            
            logger.info(f"Replaced {len(mapping)} values in {column}")
            return self
        except Exception as e:
            logger.error(f"Replace error: {str(e)}")
            raise
    
    def convert_types(
        self,
        type_mapping: Dict[str, str],
        name: Optional[str] = None
    ) -> 'ETLTransformer':
        """Convert column data types"""
        try:
            for col, dtype in type_mapping.items():
                if col in self.df.columns:
                    if dtype == "int":
                        self.df[col] = self.df[col].astype('int64')
                    elif dtype == "float":
                        self.df[col] = self.df[col].astype('float64')
                    elif dtype == "str":
                        self.df[col] = self.df[col].astype('str')
                    elif dtype == "datetime":
                        self.df[col] = pd.to_datetime(self.df[col])
                    elif dtype == "category":
                        self.df[col] = self.df[col].astype('category')
            
            self.transformation_log.append({
                "type": TransformationType.TYPE_CONVERT.value,
                "description": name or "Converted data types",
                "conversions": len(type_mapping),
                "timestamp": datetime.utcnow().isoformat()
            })
            
            logger.info(f"Converted types for {len(type_mapping)} columns")
            return self
        except Exception as e:
            logger.error(f"Type conversion error: {str(e)}")
            raise
    
    def get_result(self) -> pd.DataFrame:
        """Get transformed dataframe"""
        return self.df
    
    def get_log(self) -> List[Dict[str, Any]]:
        """Get transformation log"""
        return self.transformation_log
    
    def get_summary(self) -> Dict[str, Any]:
        """Get transformation summary"""
        return {
            "original_shape": self.original_df.shape,
            "final_shape": self.df.shape,
            "rows_changed": self.original_df.shape[0] - self.df.shape[0],
            "columns_changed": self.original_df.shape[1] - self.df.shape[1],
            "transformations_applied": len(self.transformation_log),
            "transformation_log": self.transformation_log
        }
    
    def reset(self) -> 'ETLTransformer':
        """Reset to original dataframe"""
        self.df = self.original_df.copy()
        self.transformation_log = []
        return self


class ETLPipeline:
    """Manage ETL pipelines"""
    
    def __init__(self, name: str):
        self.name = name
        self.stages: List[Dict[str, Any]] = []
        self.created_at = datetime.utcnow()
    
    def add_stage(
        self,
        stage_name: str,
        transformation_func: Callable,
        config: Dict[str, Any]
    ) -> 'ETLPipeline':
        """Add a transformation stage to the pipeline"""
        self.stages.append({
            "name": stage_name,
            "transformation": transformation_func,
            "config": config,
            "created_at": datetime.utcnow().isoformat()
        })
        return self
    
    def execute(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Execute the ETL pipeline"""
        try:
            transformer = ETLTransformer(df)
            
            for i, stage in enumerate(self.stages):
                logger.info(f"Executing pipeline stage {i + 1}: {stage['name']}")
                stage['transformation'](transformer, **stage['config'])
            
            return {
                "status": "success",
                "pipeline_name": self.name,
                "stages_executed": len(self.stages),
                "result": transformer.get_result(),
                "summary": transformer.get_summary(),
                "log": transformer.get_log()
            }
        except Exception as e:
            logger.error(f"Pipeline execution error: {str(e)}")
            return {
                "status": "failed",
                "error": str(e)
            }
    
    def get_info(self) -> Dict[str, Any]:
        """Get pipeline information"""
        return {
            "name": self.name,
            "stages": len(self.stages),
            "created_at": self.created_at.isoformat(),
            "stage_names": [s["name"] for s in self.stages]
        }
