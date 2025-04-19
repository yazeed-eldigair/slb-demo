from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager

from .database.database import engine, Base
from .database import crud, init_db
from .routers import wells, production

# Create the database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize the database with sample data if it's empty
    init_db.initialize_database()
    yield

app = FastAPI(
    title="Oil Production API",
    description="API for oil production data visualization",
    version="0.1.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(wells.router, prefix="/api", tags=["wells"])
app.include_router(production.router, prefix="/api", tags=["production"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Oil Production API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
