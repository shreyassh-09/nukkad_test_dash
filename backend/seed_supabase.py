import os
from dotenv import load_dotenv
from supabase import create_client, Client

# 1. Dynamically resolve absolute paths to ensure zero directory resolution conflicts
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, ".env")
LOGS_DIR = os.path.join(BASE_DIR, "logs")

# 2. Aggressively clear stale memory caches and strictly parse the adjacent .env file
load_dotenv(dotenv_path=ENV_PATH, override=True)

# 3. Securely ingest authorized connection vectors
SUPABASE_URL = os.getenv("SUPABASE_URL")
# Adjust this variable string if named SUPABASE_KEY inside your backend/.env
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") 

# --- PRE-FLIGHT VERIFICATION ---
print("\n=== CREDENTIALS DEBUGGER ===")
print(f"Reading .env from: {ENV_PATH}")
print(f"URL Seen: {SUPABASE_URL}")
if SUPABASE_KEY:
    print(f"Key Seen: {SUPABASE_KEY[:10]}... [Total Length: {len(SUPABASE_KEY)} chars]")
else:
    print("\n❌ CRITICAL: Python sees None. Ensure your os.getenv string matches your .env key name!")
print("============================\n")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("Seeding execution halted: Credentials missing or unreadable.")

# Initialize production database client with full RLS security bypass access
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def _read_semrush_csv(filename: str):
    """Safely opens physical files, bridges semicolon delimiters, and maps row entities."""
    filepath = os.path.join(LOGS_DIR, filename)
    if not os.path.exists(filepath):
        print(f"Skipping buffer: Target cache missing -> {filename}")
        return []
    
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read().strip()
        
    lines = text.split("\n")
    if len(lines) < 2:
        return []
        
    headers = [h.strip() for h in lines[0].split(";")]
    data = []
    
    for row in lines[1:]:
        if not row.strip(): 
            continue
        values = [v.strip() for v in row.split(";")]
        data.append(dict(zip(headers, values)))
        
    return data

def seed_keywords():
    print("Seeding Top Keywords pipeline...")
    raw = _read_semrush_csv("keywords.csv")
    for val in raw:
        share_str = val.get("Traffic (%)", val.get("Tr", "0")).replace("%", "").strip()
        record = {
            "keyword": val.get("Keyword", val.get("Phrase", val.get("Ph", ""))),
            "intent": val.get("Intents", val.get("In", "")),
            "position": int(val.get("Position", val.get("Po", 0))),
            "serp_features": int(val.get("SERP Features", val.get("Sf", 0))),
            "search_volume": int(val.get("Search Volume", val.get("Nq", 0))),
            "cpc": float(val.get("CPC", val.get("Cp", 0.0))),
            "traffic_share": float(share_str) if share_str else 0.0,
            "difficulty": float(val.get("Keyword Difficulty", val.get("Kd", 0.0))),
            "url": val.get("Url", val.get("Ur", ""))
        }
        supabase.table("keywords").insert(record).execute()

def seed_traffic():
    print("Seeding Historical Traffic metrics...")
    raw = _read_semrush_csv("traffic.csv")
    for val in raw:
        record = {
            "date": val.get("Date", val.get("Dt", "")),
            "organic_traffic": int(val.get("Organic Traffic", val.get("Ot", 0))),
            "paid_traffic": int(val.get("Adwords Traffic", val.get("At", 0))),
            "top_3": int(val.get("X0", 0)),
            "top_10": int(val.get("X1", 0)),
            "top_20": int(val.get("X2", 0)),
            "top_50": int(val.get("X3", 0)),
            "top_100": int(val.get("X4", 0)),
            "features_keywords": int(val.get("FKn", 0))
        }
        supabase.table("traffic").insert(record).execute()

def seed_pages():
    print("Seeding Landing Pages distributions...")
    raw = _read_semrush_csv("pages.csv")
    for val in raw:
        share_str = val.get("Traffic (%)", val.get("Tr", "0")).replace("%", "").strip()
        record = {
            "url": val.get("Url", val.get("Ur", "")),
            "keywords_count": int(val.get("Number of Keywords", val.get("Pc", 0))),
            "traffic": int(val.get("Traffic", val.get("Tg", 0))),
            "traffic_share": float(share_str) if share_str else 0.0
        }
        supabase.table("pages").insert(record).execute()

def seed_positions():
    print("Seeding Dynamic Position variations...")
    files = {
        "new": "position_new.csv", 
        "lost": "position_lost.csv", 
        "rise": "position_rise.csv", 
        "fall": "position_fall.csv"
    }
    
    for pos_type, filename in files.items():
        raw = _read_semrush_csv(filename)
        for val in raw:
            share_str = val.get("Traffic (%)", val.get("Tr", "0")).replace("%", "").strip()
            record = {
                "keyword": val.get("Keyword", val.get("Phrase", val.get("Ph", ""))),
                "previous_position": val.get("Previous Position", val.get("Pp", "-")),
                "current_position": val.get("Position", val.get("Po", "-")),
                "pages_count": int(val.get("Number of Results", val.get("Np", 0))),
                "search_volume": int(val.get("Search Volume", val.get("Nq", 0))),
                "traffic_share": float(share_str) if share_str else 0.0,
                "pos_type": pos_type
            }
            supabase.table("positions").insert(record).execute()

if __name__ == "__main__":
    print("Commencing automated database seeding to cloud infrastructure...")
    seed_keywords()
    seed_traffic()
    seed_pages()
    seed_positions()
    print("\nSUCCESS: Your Supabase cloud database is fully seeded and ready for production demo!")