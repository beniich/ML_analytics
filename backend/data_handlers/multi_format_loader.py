import pandas as pd
import json
import sqlite3
from typing import Union, Dict, Any
import io

class MultiFormatLoader:
    @staticmethod
    def load_from_file(file_content: bytes, file_extension: str) -> pd.DataFrame:
        """Charge des données depuis différents formats de fichiers"""
        if file_extension.lower() == 'csv':
            return pd.read_csv(io.StringIO(file_content.decode('utf-8')))
        elif file_extension.lower() in ['xlsx', 'xls']:
            return pd.read_excel(io.BytesIO(file_content))
        elif file_extension.lower() == 'json':
            data = json.loads(file_content.decode('utf-8'))
            return pd.DataFrame(data)
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")
    
    @staticmethod
    def load_from_sql(connection_string: str, query: str) -> pd.DataFrame:
        """Charge des données depuis une base SQL"""
        try:
            conn = sqlite3.connect(connection_string)
            df = pd.read_sql_query(query, conn)
            conn.close()
            return df
        except Exception as e:
            raise Exception(f"SQL connection failed: {str(e)}")
    
    @staticmethod
    def convert_to_format(df: pd.DataFrame, format_type: str) -> Union[str, bytes]:
        """Convertit DataFrame vers différents formats"""
        if format_type.lower() == 'csv':
            return df.to_csv(index=False)
        elif format_type.lower() == 'json':
            return df.to_json(orient='records')
        elif format_type.lower() == 'excel':
            output = io.BytesIO()
            df.to_excel(output, index=False)
            return output.getvalue()
        else:
            raise ValueError(f"Unsupported output format: {format_type}")

# Utilitaire pour FastAPI
def get_file_extension(filename: str) -> str:
    return filename.split('.')[-1] if '.' in filename else ''

def validate_supported_format(filename: str) -> bool:
    supported_extensions = ['csv', 'xlsx', 'xls', 'json']
    ext = get_file_extension(filename).lower()
    return ext in supported_extensions
