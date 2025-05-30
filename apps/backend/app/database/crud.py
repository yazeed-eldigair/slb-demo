from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import date
from typing import List, Optional

from ..models.models import Well, Production

# Well CRUD operations
def get_well(db: Session, well_id: int):
    return db.query(Well).filter(Well.id == well_id).first()

def get_wells(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Well).offset(skip).limit(limit).all()


# Production CRUD operations
def get_production(db: Session, production_id: int):
    return db.query(Production).filter(Production.id == production_id).first()

def get_productions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Production).offset(skip).limit(limit).all()

def get_production_by_date_range(
    db: Session, 
    start_date: Optional[date] = None, 
    end_date: Optional[date] = None,
    well_name: Optional[str] = None,
    region: Optional[str] = None,
    skip: int = 0, 
    limit: int = 100
):
    # Start with a query for Production
    query = db.query(Production)
    
    # Apply date range filter if provided
    if start_date and end_date:
        query = query.filter(and_(Production.date >= start_date, Production.date <= end_date))
    elif start_date:
        query = query.filter(Production.date >= start_date)
    elif end_date:
        query = query.filter(Production.date <= end_date)
    
    # Join the Well table only once, then apply both filters if needed
    has_well_filters = well_name is not None or region is not None
    if has_well_filters:
        query = query.join(Well)
        
        # Build filters for well conditions
        well_filters = []
        if well_name:
            well_filters.append(Well.name == well_name)
        if region:
            well_filters.append(Well.region == region)
            
        # Apply all well filters at once
        if well_filters:
            query = query.filter(and_(*well_filters))
    
    return query.offset(skip).limit(limit).all()
