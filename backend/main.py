import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config.settings import validate_config
from routes import (
    ingest_routes,
    cluster_routes,
    ngo_routes,
    match_routes,
    need_routes,
    task_routes,
    volunteer_routes,
    proof_routes,
    chat_routes,
    story_routes,
    public_routes,
    event_routes,
    logistics_routes,
)

validate_config()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ngo-platform")

app = FastAPI(title="NGO Coordination Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # your Vite dev server
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
app.include_router(volunteer_routes.router)
app.include_router(proof_routes.router)
app.include_router(chat_routes.router)
app.include_router(story_routes.router)
app.include_router(public_routes.router)
app.include_router(event_routes.router)
app.include_router(logistics_routes.router)


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