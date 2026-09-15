from fastapi import FastAPI

from backend.api.investigation import router as investigation_router


app = FastAPI(
    title="Evidence-Backed Crypto Investigation Graph",
    description="SIH 2026 — SIH26183",
    version="0.1.0",
)


app.include_router(investigation_router)


@app.get("/")
def root():
    return {
        "project": "Evidence-Backed Crypto Investigation Graph",
        "status": "online",
        "version": "0.1.0",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }