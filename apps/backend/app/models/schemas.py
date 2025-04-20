from pydantic import BaseModel
from datetime import date
from typing import List, Optional

# Well schemas
class WellBase(BaseModel):
    name: str
    region: str
    latitude: float
    longitude: float
    status: str

class Well(WellBase):
    id: int

    class Config:
        orm_mode = True

# Production schemas
class ProductionBase(BaseModel):
    date: date
    oil_production: float
    gas_production: float
    water_production: float

class Production(ProductionBase):
    id: int
    well_id: int

    class Config:
        orm_mode = True

# Filter schemas
class ProductionFilter(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    well_name: Optional[str] = None
    region: Optional[str] = None
