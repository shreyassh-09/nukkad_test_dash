from supabase import create_client, Client
from app.config import settings

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

def get_keywords_graph_data():
    """Fetches full analytical data from the 'keywords' Postgres table."""
    response = supabase.table("keywords").select("*").order("traffic_share", desc=True).execute()
    
    # Standardize single-letter UI Intent arrays natively
    parsed = []
    for k in response.data:
        raw_intent = k.get("intent", "") or ""
        intents = []
        if "0" in raw_intent or "Commercial" in raw_intent: intents.append("C")
        if "1" in raw_intent or "Informational" in raw_intent: intents.append("I")
        if "2" in raw_intent or "Navigational" in raw_intent: intents.append("N")
        if "3" in raw_intent or "Transactional" in raw_intent: intents.append("T")
        if not intents: intents.append("I") # Fallback default
        
        parsed.append({
            **k,
            "parsed_intents": intents
        })
    return parsed

def get_traffic_dashboard_data():
    """Fetches time-series arrays including AI Overview buffers."""
    response = supabase.table("traffic").select("*").order("date", desc=False).execute()
    parsed = []
    for t in response.data:
        parsed.append({
            **t,
            # Map fallback zeroes if your legacy CSV imports lacked these distinct columns
            "ai_overviews": t.get("ai_overviews", 0), 
            "features_keywords": t.get("features_keywords", 0)
        })
    return parsed

def get_top_pages_data():
    response = supabase.table("pages").select("*").order("traffic_share", desc=True).execute()
    return response.data

def get_position_changes_data():
    response = supabase.table("positions").select("*").execute()
    all_positions = response.data
    return {
        "new": [p for p in all_positions if p.get("pos_type") == "new"],
        "lost": [p for p in all_positions if p.get("pos_type") == "lost"],
        "rise": [p for p in all_positions if p.get("pos_type") == "rise"],
        "fall": [p for p in all_positions if p.get("pos_type") == "fall"]
    }