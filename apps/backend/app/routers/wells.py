from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database.database import get_db
from ..database import crud
from ..models.schemas import Well

router = APIRouter()

@router.get("/wells/", response_model=List[Well])
def read_wells(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    wells = crud.get_wells(db, skip=skip, limit=limit)
    return wells

@router.get("/wells/{well_id}", response_model=Well)
def read_well(well_id: int, db: Session = Depends(get_db)):
    db_well = crud.get_well(db, well_id=well_id)
    if db_well is None:
        raise HTTPException(status_code=404, detail="Well not found")
    return db_well

