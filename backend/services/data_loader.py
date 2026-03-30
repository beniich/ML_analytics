"""
Multi-Format Data Loader
Handles loading and converting data from multiple formats
"""
import pandas as pd
import json
import sqlite3
from typing import Union, Dict, Any, Optional
import io
import logging

logger = logging.getLogger(__name__)

class MultiFormatLoader:
    """Load and convert data from multiple formats"""
    
    SUPPORTED_FORMATS = ['csv', 'xlsx', 'xls', 'json', 'sql', 'sqlite', 'parquet']
    
    @staticmethod
    def load_from_file(file_content: bytes, file_extension: str, **kwargs) -> pd.DataFrame:
        """Load data from various file formats"""
        try:
            ext = file_extension.lower().strip('.')
            
            if ext == 'csv':
                return pd.read_csv(io.StringIO(file_content.decode('utf-8')), **kwargs)
            elif ext in ['xlsx', 'xls']:
                return pd.read_excel(io.BytesIO(file_content), **kwargs)
            elif ext == 'json':
                data = json.loads(file_content.decode('utf-8'))
                if isinstance(data, list):
                    return pd.DataFrame(data)
                return pd.DataFrame([data])
            elif ext == 'parquet':
                return pd.read_parquet(io.BytesIO(file_content), **kwargs)
            else:
                raise ValueError(f"Unsupported format: {ext}")
        except Exception as e:
            logger.error(f"Error loading file: {str(e)}")
            raise
    
    @staticmethod
    def convert_to_format(df: pd.DataFrame, format_type: str, **kwargs) -> Union[str, bytes]:
        """Convert DataFrame to various formats"""
        try:
            fmt = format_type.lower().strip('.')
            
            if fmt == 'csv':
                return df.to_csv(index=False, **kwargs)
            elif fmt == 'json':
                return df.to_json(orient='records', **kwargs)
            elif fmt in ['excel', 'xlsx']:
                output = io.BytesIO()
                df.to_excel(output, index=False, **kwargs)
                return output.getvalue()
            elif fmt == 'parquet':
                output = io.BytesIO()
                df.to_parquet(output, index=False, **kwargs)
                return output.getvalue()
            else:
                raise ValueError(f"Unsupported format: {fmt}")
        except Exception as e:
            logger.error(f"Error converting format: {str(e)}")
            raise
    
    @staticmethod
    def validate_format(filename: str) -> bool:
        """Check if format is supported"""
        ext = filename.split('.')[-1].lower() if '.' in filename else ''
        return ext in MultiFormatLoader.SUPPORTED_FORMATS

def validate_supported_format(filename: str) -> bool:
    """Validate if file format is supported"""
    return MultiFormatLoader.validate_format(filename)
