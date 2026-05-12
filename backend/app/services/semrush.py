import os
import csv
import json
import requests
from datetime import datetime
from app.config import settings

# Establish absolute log path relative to the project directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
LOGS_DIR = os.path.join(BASE_DIR, "logs")
os.makedirs(LOGS_DIR, exist_ok=True)

def fetch_domain_rank_history(domain: str = "gonukkad.com", database: str = "in", limit: int = 12):
    url = "https://api.semrush.com/"
    params = {
        "type": "domain_rank_history",
        "key": settings.SEMRUSH_API_KEY,
        "domain": domain,
        "database": database,
        "display_limit": limit,
        "export_columns": "Dt,Ot,At,X0,X1,X2,X3,X4"
    }
    
    # 1. Fetch live data from Semrush
    response = requests.get(url, params=params)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_domain = domain.replace(".", "_")
    
    # 2. LOG 1: Save the raw fetched response directly as a CSV file
    raw_log_path = os.path.join(LOGS_DIR, f"raw_{safe_domain}_{timestamp}.csv")
    with open(raw_log_path, "w", encoding="utf-8") as raw_file:
        raw_file.write(response.text)
        
    if response.status_code != 200:
        raise Exception(f"Semrush API Error: {response.text}")
        
    lines = response.text.strip().split("\n")
    if not lines or len(lines) < 2:
        return []
        
    # Correctly handle the semicolon delimiter returned by Semrush
    headers = lines[0].split(";")
    historical_data = []
    
    for row in lines[1:]:
        values = row.split(";")
        row_dict = dict(zip(headers, values))
        
        # Extract values mapping precisely to full column headers
        historical_data.append({
            "date": row_dict.get("Date", ""),
            "organic_traffic": int(row_dict.get("Organic Traffic", 0)),
            "paid_traffic": int(row_dict.get("Adwords Traffic", 0)),
            "top_3": int(row_dict.get("X0", 0)),
            "top_10": int(row_dict.get("X1", 0)),
            "top_20": int(row_dict.get("X2", 0)),
            "top_50": int(row_dict.get("X3", 0)),
            "top_100": int(row_dict.get("X4", 0)),
            "features_keywords": 0
        })
        
    # 3. LOG 2: Save a standardized, parsed CSV fallback file
    processed_csv_path = os.path.join(LOGS_DIR, f"processed_{safe_domain}_{timestamp}.csv")
    with open(processed_csv_path, "w", newline="", encoding="utf-8") as csv_file:
        fieldnames = ["date", "organic_traffic", "paid_traffic", "top_3", "top_10", "top_20", "top_50", "top_100", "features_keywords"]
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        
        writer.writeheader()
        writer.writerows(historical_data)

    # 4. LOG 3: Keep the JSON log for React state comparison
    parsed_json_path = os.path.join(LOGS_DIR, f"state_{safe_domain}_{timestamp}.json")
    with open(parsed_json_path, "w", encoding="utf-8") as json_file:
        json.dump(historical_data, json_file, indent=4)
        
    return historical_data