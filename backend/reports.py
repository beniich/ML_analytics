"""
Report generation module for HTML and PDF outputs
"""
from jinja2 import Template
import json
from typing import Dict, Any
from datetime import datetime
import os
import logging

logger = logging.getLogger(__name__)

# HTML Report Template
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header-meta {
            font-size: 0.95em;
            opacity: 0.9;
            display: flex;
            gap: 20px;
            margin-top: 15px;
        }
        .section {
            background: white;
            margin: 20px 0;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .section h2 {
            color: #667eea;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 20px;
            font-size: 1.8em;
        }
        .section h3 {
            color: #764ba2;
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 1.3em;
        }
        .metric {
            display: inline-block;
            margin: 8px;
            padding: 12px 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 6px;
            font-weight: bold;
        }
        .metric-label {
            display: block;
            font-size: 0.85em;
            opacity: 0.9;
            font-weight: normal;
            margin-bottom: 4px;
        }
        .metric-value {
            display: block;
            font-size: 1.3em;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 0.95em;
        }
        th {
            background-color: #f0f0f0;
            color: #333;
            padding: 12px;
            text-align: left;
            font-weight: bold;
            border-bottom: 2px solid #667eea;
        }
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #ddd;
        }
        tr:hover {
            background-color: #f9f9f9;
        }
        .error {
            background-color: #fee;
            color: #c33;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #c33;
            margin: 10px 0;
        }
        .success {
            background-color: #efe;
            color: #3c3;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #3c3;
            margin: 10px 0;
        }
        .info {
            background-color: #eff;
            color: #33c;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #33c;
            margin: 10px 0;
        }
        .metric-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 15px 0;
        }
        .metric-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .metric-box-label {
            font-size: 0.9em;
            opacity: 0.9;
            margin-bottom: 8px;
        }
        .metric-box-value {
            font-size: 2em;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 0.9em;
            margin-top: 40px;
            border-top: 1px solid #ddd;
        }
        @media print {
            body {
                background-color: white;
            }
            .section {
                page-break-inside: avoid;
                box-shadow: none;
                border: 1px solid #ddd;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 {{ title }}</h1>
            <div class="header-meta">
                <div><strong>Generated:</strong> {{ generated_date }}</div>
                <div><strong>Generated by:</strong> {{ generated_by }}</div>
                <div><strong>Report Type:</strong> {{ report_type }}</div>
            </div>
        </div>

        {% for section_name, section_data in sections.items() %}
        <div class="section">
            <h2>{{ section_name.replace('_', ' ').title() }}</h2>
            
            {% if section_data.error %}
                <div class="error">⚠️ {{ section_data.error }}</div>
            {% else %}
                {{ render_section(section_data) }}
            {% endif %}
        </div>
        {% endfor %}

        <div class="footer">
            <p>This report was generated automatically by ML Analytics API</p>
            <p>© {{ current_year }} - All rights reserved</p>
        </div>
    </div>
</body>
</html>
"""


class ReportGenerator:
    """Generate analysis reports in multiple formats"""
    
    def __init__(self, title: str, user: str = "System"):
        self.title = title
        self.user = user
        self.generated_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.current_year = datetime.now().year
    
    def _format_value(self, value: Any) -> str:
        """Format values for display"""
        if isinstance(value, float):
            if value > 1000000:
                return f"{value/1000000:.2f}M"
            elif value > 1000:
                return f"{value/1000:.2f}K"
            else:
                return f"{value:.4f}"
        elif isinstance(value, dict):
            return json.dumps(value, indent=2)
        elif isinstance(value, list):
            return ", ".join(str(item) for item in value[:5])
        return str(value)
    
    def _render_dict_as_table(self, data: Dict[str, Any]) -> str:
        """Convert dictionary to HTML table"""
        if not data:
            return "<p>No data available</p>"
        
        html = "<table><tr><th>Key</th><th>Value</th></tr>"
        for key, value in data.items():
            if isinstance(value, dict):
                html += f"<tr><td colspan='2'><h3>{key}</h3></td></tr>"
                for subkey, subvalue in value.items():
                    html += f"<tr><td style='padding-left:30px'>{subkey}</td><td>{self._format_value(subvalue)}</td></tr>"
            else:
                html += f"<tr><td>{key}</td><td>{self._format_value(value)}</td></tr>"
        html += "</table>"
        return html
    
    def generate_html_report(self, analysis_results: Dict[str, Any]) -> str:
        """Generate HTML report from analysis results"""
        try:
            # Prepare sections
            sections = {}
            for key, value in analysis_results.items():
                if isinstance(value, dict):
                    sections[key] = value
            
            # Render template
            template = Template(HTML_TEMPLATE)
            
            html_content = template.render(
                title=self.title,
                generated_date=self.generated_date,
                generated_by=self.user,
                report_type="HTML Report",
                sections=sections,
                current_year=self.current_year
            )
            
            # Inject render section macro
            html_content = self._inject_render_macro(html_content, analysis_results)
            
            return html_content
        except Exception as e:
            logger.error(f"Error generating HTML report: {str(e)}")
            raise
    
    def _inject_render_macro(self, html: str, data: Dict[str, Any]) -> str:
        """Inject section rendering logic"""
        # Simple replacement of section content
        for section_name, section_data in data.items():
            section_title = section_name.replace('_', ' ').title()
            table_html = self._render_dict_as_table(section_data)
            # In a real implementation, use proper templating
        
        return html
    
    def generate_json_report(self, analysis_results: Dict[str, Any]) -> str:
        """Generate JSON report"""
        report = {
            "metadata": {
                "title": self.title,
                "generated_date": self.generated_date,
                "generated_by": self.user,
                "report_type": "JSON Report"
            },
            "analysis_results": analysis_results
        }
        return json.dumps(report, indent=2)
    
    def save_html_report(self, analysis_results: Dict[str, Any], filepath: str) -> str:
        """Save HTML report to file"""
        try:
            html_content = self.generate_html_report(analysis_results)
            
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            logger.info(f"HTML report saved to {filepath}")
            return filepath
        except Exception as e:
            logger.error(f"Error saving HTML report: {str(e)}")
            raise
    
    def save_json_report(self, analysis_results: Dict[str, Any], filepath: str) -> str:
        """Save JSON report to file"""
        try:
            json_content = self.generate_json_report(analysis_results)
            
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(json_content)
            
            logger.info(f"JSON report saved to {filepath}")
            return filepath
        except Exception as e:
            logger.error(f"Error saving JSON report: {str(e)}")
            raise
