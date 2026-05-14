from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.semrush import (
    get_keywords_graph_data,
    get_traffic_dashboard_data,
    get_top_pages_data,
    get_position_changes_data
)

app = FastAPI(title="GoNukkad Dashboard")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/dashboard/pipeline")
def get_master_pipeline():
    try:
        return {
            "status": "success",
            "data": {
                "keywords": get_keywords_graph_data(),
                "traffic": get_traffic_dashboard_data(),
                "pages": get_top_pages_data(),
                "positions": get_position_changes_data()
            }
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)