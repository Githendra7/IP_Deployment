from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router
from app.api.auth import router as auth_router

app = FastAPI(title="AI-Assisted Product Development Support Tool")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Modular router registration
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(api_router, prefix="/api")

