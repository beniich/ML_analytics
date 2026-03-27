from jinja2 import Template
import pdfkit
from datetime import datetime
import os

# Template HTML pour rapport
HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Rapport d'analyse - {{ title }}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background-color: #f0f0f0; padding: 20px; border-radius: 5px; }
        .section { margin: 20px 0; padding: 15px; border-left: 4px solid #007cba; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .metric { display: inline-block; margin: 5px; padding: 10px; background: #e7f3ff; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ title }}</h1>
        <p>Généré le: {{ date }}</p>
        <p>Analysé par: {{ user }}</p>
    </div>
    
    {% for section_name, section_data in sections.items() %}
    <div class="section">
        <h2>{{ section_name.replace('_', ' ').title() }}</h2>
        {% if section_data is mapping %}
            {% for key, value in section_data.items() %}
                {% if value is mapping %}
                    <h3>{{ key }}</h3>
                    <table>
                        {% for subkey, subvalue in value.items() %}
                            <tr><td>{{ subkey }}</td><td>{{ subvalue }}</td></tr>
                        {% endfor %}
                    </table>
                {% else %}
                    <div class="metric"><strong>{{ key }}:</strong> {{ value }}</div>
                {% endif %}
            {% endfor %}
        {% elif section_data is iterable and section_data is not string %}
            <ul>
            {% for item in section_data %}
                <li>{{ item }}</li>
            {% endfor %}
            </ul>
        {% else %}
            <p>{{ section_data }}</p>
        {% endif %}
    </div>
    {% endfor %}
</body>
</html>
"""

def generate_html_report(title: str, sections: dict, user: str = "System") -> str:
    template = Template(HTML_TEMPLATE)
    return template.render(
        title=title,
        sections=sections,
        date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        user=user
    )

def generate_pdf_report(html_content: str, output_path: str) -> str:
    options = {
        'page-size': 'A4',
        'margin-top': '0.75in',
        'margin-right': '0.75in',
        'margin-bottom': '0.75in',
        'margin-left': '0.75in',
        'encoding': "UTF-8",
        'no-outline': None
    }
    
    # Check if wkhtmltopdf is installed
    try:
        pdfkit.from_string(html_content, output_path, options=options)
        return output_path
    except Exception as e:
        print(f"Failed to generate PDF: {e}")
        return None

def save_report_to_db(db, user_id: int, report_name: str, report_data: dict, report_type: str):
    from ..database.models import AnalysisReport
    import json
    
    report = AnalysisReport(
        user_id=user_id,
        report_name=report_name,
        report_data=json.dumps(report_data),
        report_type=report_type
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
