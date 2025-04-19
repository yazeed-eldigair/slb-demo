from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from ..database.database import get_db
from ..database import crud
from ..models.schemas import Production, ProductionCreate, ProductionFilter

router = APIRouter()

@router.get("/production/", response_model=List[Production])
def read_productions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    productions = crud.get_productions(db, skip=skip, limit=limit)
    return productions

@router.get("/production/{production_id}", response_model=Production)
def read_production(production_id: int, db: Session = Depends(get_db)):
    db_production = crud.get_production(db, production_id=production_id)
    if db_production is None:
        raise HTTPException(status_code=404, detail="Production record not found")
    return db_production

@router.get("/production/well/{well_id}", response_model=List[Production])
def read_production_by_well(well_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    db_well = crud.get_well(db, well_id=well_id)
    if db_well is None:
        raise HTTPException(status_code=404, detail="Well not found")
    productions = crud.get_production_by_well(db, well_id=well_id, skip=skip, limit=limit)
    return productions

@router.post("/production/filter/", response_model=List[Production])
def filter_production(
    filter_params: ProductionFilter,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    productions = crud.get_production_by_date_range(
        db, 
        start_date=filter_params.start_date,
        end_date=filter_params.end_date,
        well_name=filter_params.well_name,
        region=filter_params.region,
        skip=skip, 
        limit=limit
    )
    return productions

@router.post("/production/", response_model=Production)
def create_production(production: ProductionCreate, db: Session = Depends(get_db)):
    db_well = crud.get_well(db, well_id=production.well_id)
    if db_well is None:
        raise HTTPException(status_code=404, detail="Well not found")
    return crud.create_production(db=db, production=production)
