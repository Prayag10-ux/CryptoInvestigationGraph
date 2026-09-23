from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.investigation import router as investigation_router


app = FastAPI(
    title="Evidence-Backed Crypto Investigation Graph",
    description="SIH 2026 — SIH26183",
    version="0.1.0",
)

# Allow the local Next.js frontend to call the FastAPI backend directly.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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