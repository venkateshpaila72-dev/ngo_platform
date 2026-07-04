import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes import ingest_routes
from config.settings import validate_config
from routes import ingest_routes, cluster_routes
from routes import ingest_routes, cluster_routes, ngo_routes, match_routes, need_routes, task_routes


validate_config()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ngo-platform")

app = FastAPI(title="NGO Coordination Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest_routes.router)
app.include_router(cluster_routes.router)
app.include_router(ngo_routes.router)
app.include_router(match_routes.router)
app.include_router(need_routes.router)
app.include_router(task_routes.router)


@app.get("/")
def root():
    return {"status": "API is running"}


@app.get("/health")
def health_check():
    from config.firebase_config import get_firestore_client
    try:
        get_firestore_client()
        return {"status": "healthy", "firestore": "connected"}
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={"status": "unhealthy", "firestore": "unreachable", "error": str(e)},
        )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"status": "error", "detail": "Something went wrong. Check server logs."},
    )