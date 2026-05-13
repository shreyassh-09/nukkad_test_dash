import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
LOGS_DIR = os.path.join(BASE_DIR, "logs")

def fetch_domain_rank_history(domain: str = "gonukkad.com", database: str = "in", limit: int = 12, **kwargs):
    csv_path = os.path.join(LOGS_DIR, "postman_data.csv")
    
    if not os.path.exists(csv_path):
        raise Exception(f"Critical: Could not find your data file at {csv_path}")
        
    print("INJECTING verified Postman data stream directly into dashboard...")
    
    with open(csv_path, "r", encoding="utf-8") as f:
        raw_text = f.read().strip()
        
    lines = raw_text.split("\n")
    if len(lines) < 2:
        return []
        
    headers = lines[0].split(";")
    historical_data = []
    
    for row in lines[1:]:
        if not row.strip():
            continue
        values = row.split(";")
        row_dict = dict(zip(headers, values))
        
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
        
    return historical_data[:limit]