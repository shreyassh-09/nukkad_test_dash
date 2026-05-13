from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.semrush import fetch_domain_rank_history

app = FastAPI(title="SEO Performance Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/dashboard/seo-history")
def get_seo_history(domain: str = "gonukkad.com", limit: int = 12, refresh: bool = False):
    try:
        # Force a live pull by passing refresh=True from the frontend
        use_cache = not refresh
        data = fetch_domain_rank_history(domain=domain, limit=limit, use_cache=use_cache)
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)