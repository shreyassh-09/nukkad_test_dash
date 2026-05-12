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
def get_seo_history(domain: str = "gonukkad.com", limit: int = 12):
    try:
        data = fetch_domain_rank_history(domain=domain, limit=limit)
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    # pyrefly: ignore [missing-import]
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)