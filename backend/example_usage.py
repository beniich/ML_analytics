"""
Example usage script for ML Analytics API
Demonstrates all major features
"""
import requests
import json
import time
from pathlib import Path

BASE_URL = "http://localhost:8000"
HEADERS = {"Content-Type": "application/json"}


class MLAnalyticsClient:
    """Client for interacting with ML Analytics API"""
    
    def __init__(self, base_url=BASE_URL):
        self.base_url = base_url
        self.access_token = None
        self.refresh_token = None
        self.user_info = None
    
    def register(self, username: str, email: str, password: str, full_name: str = ""):
        """Register a new user"""
        response = requests.post(
            f"{self.base_url}/api/auth/register",
            json={
                "username": username,
                "email": email,
                "password": password,
                "full_name": full_name
            },
            headers=HEADERS
        )
        return response.json()
    
    def login(self, username: str, password: str):
        """Login and store tokens"""
        response = requests.post(
            f"{self.base_url}/api/auth/login",
            json={"username": username, "password": password},
            headers=HEADERS
        )
        
        if response.status_code == 200:
            data = response.json()
            self.access_token = data["access_token"]
            self.refresh_token = data["refresh_token"]
            self.user_info = data["user"]
            return data
        else:
            raise Exception(f"Login failed: {response.text}")
    
    def get_auth_headers(self):
        """Get headers with auth token"""
        return {
            **HEADERS,
            "Authorization": f"Bearer {self.access_token}"
        }
    
    def analyze_file_basic(self, filepath: str):
        """Run basic analysis on a file"""
        with open(filepath, 'rb') as f:
            files = {'file': f}
            response = requests.post(
                f"{self.base_url}/api/analysis/basic",
                files=files,
                headers={"Authorization": f"Bearer {self.access_token}"}
            )
        return response.json()
    
    def analyze_file_correlation(self, filepath: str):
        """Run correlation analysis"""
        with open(filepath, 'rb') as f:
            files = {'file': f}
            response = requests.post(
                f"{self.base_url}/api/analysis/correlation",
                files=files,
                headers={"Authorization": f"Bearer {self.access_token}"}
            )
        return response.json()
    
    def analyze_file_complete(self, filepath: str, report_format: str = "json"):
        """Run complete analysis with report generation"""
        with open(filepath, 'rb') as f:
            files = {'file': f}
            response = requests.post(
                f"{self.base_url}/api/analysis/complete",
                files=files,
                params={"report_format": report_format},
                headers={"Authorization": f"Bearer {self.access_token}"}
            )
        return response.json()
    
    def list_reports(self, skip: int = 0, limit: int = 10):
        """List all reports for the user"""
        response = requests.get(
            f"{self.base_url}/api/reports",
            params={"skip": skip, "limit": limit},
            headers=self.get_auth_headers()
        )
        return response.json()
    
    def get_report(self, report_id: int):
        """Get specific report"""
        response = requests.get(
            f"{self.base_url}/api/reports/{report_id}",
            headers=self.get_auth_headers()
        )
        return response.json()
    
    def get_current_user(self):
        """Get current user information"""
        response = requests.get(
            f"{self.base_url}/api/users/me",
            headers=self.get_auth_headers()
        )
        return response.json()


def create_sample_csv():
    """Create a sample CSV file for testing"""
    import csv
    import random
    
    filename = "sample_data.csv"
    
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['Age', 'Salary', 'Years_Experience', 'Score', 'Category'])
        
        for i in range(100):
            age = random.randint(20, 70)
            salary = random.randint(30000, 150000)
            exp = random.randint(0, 40)
            score = random.randint(50, 100)
            category = random.choice(['A', 'B', 'C'])
            
            writer.writerow([age, salary, exp, score, category])
    
    return filename


def print_section(title):
    """Print a formatted section header"""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")


def main():
    """Main example workflow"""
    
    print_section("ML Analytics API - Example Usage")
    
    # Create sample data
    print("Creating sample CSV file...")
    csv_file = create_sample_csv()
    print(f"✓ Sample file created: {csv_file}\n")
    
    # Initialize client
    client = MLAnalyticsClient()
    
    # 1. Register
    print_section("1. User Registration")
    try:
        print("Registering new user...")
        result = client.register(
            username="analyst_demo",
            email="analyst_demo@example.com",
            password="DemoPass123!",
            full_name="Demo Analyst"
        )
        print(f"✓ Registration successful")
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"✗ Registration failed (user may already exist): {str(e)}")
    
    # 2. Login
    print_section("2. User Login")
    print("Logging in...")
    try:
        result = client.login("analyst_demo", "DemoPass123!")
        print("✓ Login successful")
        print(f"User: {client.user_info['username']}")
        print(f"Is Admin: {client.user_info['is_admin']}")
    except Exception as e:
        print(f"✗ Login failed: {str(e)}")
        return
    
    # 3. Get user info
    print_section("3. Get Current User Info")
    print("Fetching user information...")
    user_info = client.get_current_user()
    print("✓ User information retrieved:")
    print(json.dumps(user_info, indent=2))
    
    # 4. Basic Analysis
    print_section("4. Basic Statistical Analysis")
    print(f"Analyzing file: {csv_file}")
    result = client.analyze_file_basic(csv_file)
    print("✓ Analysis complete")
    
    if "data" in result:
        data = result["data"]
        print(f"  Rows: {data['shape']['rows']}")
        print(f"  Columns: {data['shape']['columns']}")
        print(f"  Duplicates: {data['duplicates']}")
        print(f"  Missing values: {sum(data['missing_values'].values())}")
    
    # 5. Correlation Analysis
    print_section("5. Correlation Analysis")
    print(f"Running correlation analysis on: {csv_file}")
    result = client.analyze_file_correlation(csv_file)
    print("✓ Correlation analysis complete")
    
    if "data" in result and "high_correlations" in result["data"]:
        print(f"  Found {len(result['data']['high_correlations'])} high correlations")
        for pair in result['data']['high_correlations'][:3]:
            print(f"    - {pair['variables'][0]} <-> {pair['variables'][1]}: {pair['correlation']:.3f}")
    
    # 6. Complete Analysis
    print_section("6. Complete Analysis with Report")
    print(f"Running complete analysis on: {csv_file}")
    result = client.analyze_file_complete(csv_file, report_format="json")
    print("✓ Complete analysis finished")
    
    if "report_id" in result:
        print(f"  Report ID: {result['report_id']}")
        print(f"  Report saved to: {result['report_path']}")
    
    # 7. List Reports
    print_section("7. List User Reports")
    print("Fetching all reports...")
    reports_result = client.list_reports()
    print(f"✓ Found {reports_result['total']} report(s)")
    
    if reports_result['reports']:
        for report in reports_result['reports'][:3]:
            print(f"  - {report['name']} ({report['type']}) - {report['created_at']}")
    
    # 8. API Health
    print_section("8. API Health Check")
    health = requests.get(f"{BASE_URL}/api/health").json()
    print(f"✓ API Status: {health['status']}")
    print(f"  Version: {health['version']}")
    print(f"  Timestamp: {health['timestamp']}")
    
    # 9. API Info
    print_section("9. API Information")
    info = requests.get(f"{BASE_URL}/api/info").json()
    print(f"API Title: {info['title']}")
    print(f"API Version: {info['version']}")
    print(f"Available endpoints:")
    for category, endpoints in info['endpoints'].items():
        print(f"\n  {category.title()}:")
        for endpoint in endpoints:
            print(f"    - {endpoint}")
    
    # Cleanup
    print_section("Cleanup")
    if Path(csv_file).exists():
        Path(csv_file).unlink()
        print(f"✓ Removed sample file: {csv_file}")
    
    print_section("Example Complete!")
    print("""
    Next steps:
    1. Access the API documentation at http://localhost:8000/api/docs
    2. Try the interactive Swagger UI
    3. Integrate the API into your application
    4. Deploy to production with proper security
    
    For more information, see README.md
    """)


if __name__ == "__main__":
    main()
